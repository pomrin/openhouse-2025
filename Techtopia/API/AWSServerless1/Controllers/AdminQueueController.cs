using AWSServerless1.Authentication;
using AWSServerless1.DAL;
using AWSServerless1.DTO;
using AWSServerless1.WebSocket;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using ProjectEFEntities.OH25EntityModels;
using System.Text.Json;

namespace AWSServerless1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            , Roles = UserRolesProperties.CONTROLLER_USER_ROLES_BOOTH_HELPER_AND_ADMIN
            )]
    public class AdminQueueController : ControllerBase
    {
        private IConfiguration _config;
        public AdminQueueController(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Returns all the queues for all 4 status - In Queue, Engraving, Pending Collection and Collected.
        /// This method will REQUIRE Authentication and for role BOOTH HELPER OR ABOVE.
        /// </summary>
        /// <param name="limit">Limit the number of records for each queue. less than or equals to 0 or empty for all.</param>
        /// <returns></returns>
        /// <response code="200">Ok</response>
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            , Roles = UserRolesProperties.CONTROLLER_USER_ROLES_BOOTH_HELPER_AND_ADMIN
            )]
        public IActionResult Get(int limit = 0)
        {
            if (limit <= 0)
            {
                limit = 0;
            }
            var inQueue = QueueDAL.GetTopQueue(QueueDAL.QUEUE_STATUS.IN_QUEUE, limit);
            var inQueueDTO = from q in inQueue
                             select QueueDTO.FromQueueEntity(q);

            var engravingQueue = QueueDAL.GetTopQueue(QueueDAL.QUEUE_STATUS.ENGRAVING, limit);
            var engravingQueueDTO = from q in engravingQueue
                                    select QueueDTO.FromQueueEntity(q);

            var pendingCollectionQueue = QueueDAL.GetTopQueue(QueueDAL.QUEUE_STATUS.PENDING_COLLECTION, limit);
            var pendingCollectionQueueDTO = from q in pendingCollectionQueue
                                            select QueueDTO.FromQueueEntity(q);

            var collectedQueue = QueueDAL.GetTopQueue(QueueDAL.QUEUE_STATUS.COLLECTED, limit);
            var collectedQueueDTO = from q in collectedQueue
                                    select QueueDTO.FromQueueEntity(q);

            AdminQueueDTO result = new AdminQueueDTO()
            {
                Queue = inQueueDTO.ToList(),
                QueueEngraving = engravingQueueDTO.ToList(),
                QueuePendingCollection = pendingCollectionQueueDTO.ToList(),
                QueueCollected = collectedQueueDTO.ToList(),
            };

            return Ok(result);
        }

        /// <summary>
        /// Add to Queue.
        /// This method will REQUIRE Authentication and for role BOOTH HELPER OR ABOVE.
        /// </summary>
        /// <param name="ticketId"></param>
        /// <returns></returns>
        /// <response code="201">Added to Queue</response>
        /// <response code="400">Missing parameter or Visitor already joined queue before.</response>
        /// <response code="404">Ticket ID not found!</response>
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            , Roles = UserRolesProperties.CONTROLLER_USER_ROLES_BOOTH_HELPER_AND_ADMIN
            )]
        public async Task<IActionResult> AddToQueue(AddToQueueDTO addToQueueInfo)
        {
            // TODO: Get the User of the TicketId
            var visitorEntity = VisitorDAL.GetVisitorByTicketId(addToQueueInfo.TicketId);
            if (visitorEntity != null)
            {
                // TODO: Check that the User have not joined the queue before
                var queueStatus = QueueDAL.GetQueueStatusVisitor(visitorEntity.VisitorId);
                switch (queueStatus)
                {
                    case QueueDAL.QUEUE_STATUS.NOT_IN_QUEUE:
                        // TODO: Add the user to the Queue
                        EngravingQueue queueEntity = QueueDAL.AddToQueue(visitorEntity.VisitorId, addToQueueInfo);
                        var broadcastAdminTask = WebsocketMessageHelper.BroadcastMessage(WebsocketMessageHelper.WEBSOCKET_GROUP_TYPES.BOOTHADMIN, WebsocketMessageHelper.WEBSOCKET_COMMAND_TYPES.UPDATE_QUEUES); // To update all the queues
                        var directMessageTask = WebsocketMessageHelper.SendDirectMessage(visitorEntity.TicketId, WebsocketMessageHelper.WEBSOCKET_COMMAND_TYPES.UPDATE_QUEUES); // To update their queue status in the Visitor App.
                        await Task.WhenAll(new List<Task>()
                            {
                                broadcastAdminTask, directMessageTask
                            });
                        return Created(new Uri(Request.GetEncodedUrl()), queueEntity);
                    case QueueDAL.QUEUE_STATUS.IN_QUEUE:
                    case QueueDAL.QUEUE_STATUS.ENGRAVING:
                    case QueueDAL.QUEUE_STATUS.PENDING_COLLECTION:
                    case QueueDAL.QUEUE_STATUS.COLLECTED:
                    default:
                        Console.WriteLine($"Visitor with TicketID: {addToQueueInfo.TicketId} cannot join the queue - Current Queue Status: {queueStatus.ToString()}.");
                        return BadRequest($"Visitor with TicketID: {addToQueueInfo.TicketId} cannot join the queue - Current Queue Status: {queueStatus.ToString()}.");
                }
            }
            else
            {
                return NotFound($"No user with the Ticket Id: {addToQueueInfo.TicketId} found!");
            }

        }

        /// <summary>
        /// Update the Queue Status 1 step up or Down. For instance, to update a status to Engraving, the current status must be In Queue or Pending Collection.
        /// </summary>
        /// <param name="updateQueueInfo">
        /// QueueStatus:
        ///  0) 0-Delete
        ///  1) 1-In Queue
        ///  2) 2-Engraving
        ///  3) 3-Pending Collection
        ///  4) 4-Collected
        /// </param>
        /// <returns></returns>
        /// <response code="200">Update successful</response>
        /// <response code="204">Queue removed</response>
        /// <response code="400">Invalid Queue Status</response>
        /// <response code="404">Ticket ID not found!</response>
        [HttpPut]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            , Roles = UserRolesProperties.CONTROLLER_USER_ROLES_BOOTH_HELPER_AND_ADMIN
            )]
        public async Task<IActionResult> UpdateQueue(AdminQueueUpdateDTO updateQueueInfo)
        {
            // Get the User of the TicketId
            var visitorEntity = VisitorDAL.GetVisitorByTicketId(updateQueueInfo.TicketId);
            if (visitorEntity != null)
            {
                var currentQueueStatus = QueueDAL.GetQueueStatusVisitor(visitorEntity.VisitorId);
                EngravingQueue queue = null;
                switch (updateQueueInfo.QUEUE_STATUS_TO_UPDATE)
                {
                    case QueueDAL.QUEUE_STATUS.NOT_IN_QUEUE:
                        // Remove from Queue!
                        if (currentQueueStatus == QueueDAL.QUEUE_STATUS.IN_QUEUE)
                        {
                            // Clear all the other dates except DateJoined
                            queue = QueueDAL.UpdateQueue(visitorEntity.VisitorId, updateQueueInfo.QUEUE_STATUS_TO_UPDATE);
                            var broadcastBoothAdminTask = WebsocketMessageHelper.BroadcastMessage(WebsocketMessageHelper.WEBSOCKET_GROUP_TYPES.BOOTHADMIN, WebsocketMessageHelper.WEBSOCKET_COMMAND_TYPES.UPDATE_QUEUES); // To update all the queues
                            var broadbastVisitorTask = WebsocketMessageHelper.BroadcastMessage(WebsocketMessageHelper.WEBSOCKET_GROUP_TYPES.VISITOR, WebsocketMessageHelper.WEBSOCKET_COMMAND_TYPES.UPDATE_QUEUES); // To update all the queues
                            await Task.WhenAll(new List<Task>()
                            {
                                broadcastBoothAdminTask, broadbastVisitorTask
                            });
                            return NoContent();
                        }
                        else
                        {
                            return BadRequest($"Current Queue Status is {currentQueueStatus}. Please update queue to either IN_QUEUE to remove this Queue.");
                        }
                        break;
                    case QueueDAL.QUEUE_STATUS.IN_QUEUE:
                        // Check that current queue status is either NOT_IN_QUEUE or ENGRAVING
                        if (currentQueueStatus == QueueDAL.QUEUE_STATUS.NOT_IN_QUEUE || currentQueueStatus == QueueDAL.QUEUE_STATUS.ENGRAVING)
                        {
                            // Clear all the other dates except DateJoined
                            queue = QueueDAL.UpdateQueue(visitorEntity.VisitorId, updateQueueInfo.QUEUE_STATUS_TO_UPDATE);

                            var broadcastBoothAdminTask = WebsocketMessageHelper.BroadcastMessage(WebsocketMessageHelper.WEBSOCKET_GROUP_TYPES.BOOTHADMIN, WebsocketMessageHelper.WEBSOCKET_COMMAND_TYPES.UPDATE_QUEUES); // To update all the queues
                            var broadbastVisitorTask = WebsocketMessageHelper.BroadcastMessage(WebsocketMessageHelper.WEBSOCKET_GROUP_TYPES.VISITOR, WebsocketMessageHelper.WEBSOCKET_COMMAND_TYPES.UPDATE_QUEUES); // To update all the queues
                            await Task.WhenAll(new List<Task>()
                            {
                                broadcastBoothAdminTask, broadbastVisitorTask
                            });
                            return Ok(queue);
                        }
                        else
                        {
                            return BadRequest($"Current Queue Status is {currentQueueStatus}. Please update queue to either NOT_IN_QUEUE or ENGRAVING to update this ticket to IN QUEUE.");
                        }
                        break;
                    case QueueDAL.QUEUE_STATUS.ENGRAVING:
                        // Check that current queue status is either IN_QUEUE or PENDING_COLLECTION
                        // Clear Pending Collection and Collected date, set engrave date
                        if (currentQueueStatus == QueueDAL.QUEUE_STATUS.IN_QUEUE || currentQueueStatus == QueueDAL.QUEUE_STATUS.PENDING_COLLECTION)
                        {
                            // Clear all the other dates except DateJoined
                            queue = QueueDAL.UpdateQueue(visitorEntity.VisitorId, updateQueueInfo.QUEUE_STATUS_TO_UPDATE);

                            var broadcastBoothAdminTask = WebsocketMessageHelper.BroadcastMessage(WebsocketMessageHelper.WEBSOCKET_GROUP_TYPES.BOOTHADMIN, WebsocketMessageHelper.WEBSOCKET_COMMAND_TYPES.UPDATE_QUEUES); // To update all the queues
                            var broadbastVisitorTask = WebsocketMessageHelper.BroadcastMessage(WebsocketMessageHelper.WEBSOCKET_GROUP_TYPES.VISITOR, WebsocketMessageHelper.WEBSOCKET_COMMAND_TYPES.UPDATE_QUEUES); // To update all the queues
                            await Task.WhenAll(new List<Task>()
                            {
                                broadcastBoothAdminTask, broadbastVisitorTask
                            });
                            return Ok(queue);
                        }
                        else
                        {
                            return BadRequest($"Current Queue Status is {currentQueueStatus}. Please update queue to either IN_QUEUE or PENDING COLLECTION to update this ticket to ENGRAVING.");
                        }
                        break;
                    case QueueDAL.QUEUE_STATUS.PENDING_COLLECTION:
                        // Check that current queue status is either ENGRAVING or COLLECTED
                        // Clear Collected date, set pending collection date
                        if (currentQueueStatus == QueueDAL.QUEUE_STATUS.ENGRAVING || currentQueueStatus == QueueDAL.QUEUE_STATUS.COLLECTED)
                        {
                            // Clear all the other dates except DateJoined
                            queue = QueueDAL.UpdateQueue(visitorEntity.VisitorId, updateQueueInfo.QUEUE_STATUS_TO_UPDATE);

                            var broadcastBoothAdminTask = WebsocketMessageHelper.BroadcastMessage(WebsocketMessageHelper.WEBSOCKET_GROUP_TYPES.BOOTHADMIN, WebsocketMessageHelper.WEBSOCKET_COMMAND_TYPES.UPDATE_QUEUES); // To update all the queues
                            var broadbastVisitorTask = WebsocketMessageHelper.BroadcastMessage(WebsocketMessageHelper.WEBSOCKET_GROUP_TYPES.VISITOR, WebsocketMessageHelper.WEBSOCKET_COMMAND_TYPES.UPDATE_QUEUES); // To update all the queues
                            await Task.WhenAll(new List<Task>()
                            {
                                broadcastBoothAdminTask, broadbastVisitorTask
                            });
                            return Ok(queue);
                        }
                        else
                        {
                            return BadRequest($"Current Queue Status is {currentQueueStatus}. Please update queue to either ENGRAVING or COLLECTED to update this ticket to PENDING COLLECTION.");
                        }
                        break;
                    case QueueDAL.QUEUE_STATUS.COLLECTED:
                        // Check that current queue status is PENDING_COLLECTION
                        // Set Collected date
                        if (currentQueueStatus == QueueDAL.QUEUE_STATUS.PENDING_COLLECTION)
                        {
                            // Clear all the other dates except DateJoined
                            queue = QueueDAL.UpdateQueue(visitorEntity.VisitorId, updateQueueInfo.QUEUE_STATUS_TO_UPDATE);

                            var broadcastBoothAdminTask = WebsocketMessageHelper.BroadcastMessage(WebsocketMessageHelper.WEBSOCKET_GROUP_TYPES.BOOTHADMIN, WebsocketMessageHelper.WEBSOCKET_COMMAND_TYPES.UPDATE_QUEUES); // To update all the queues
                            var broadbastVisitorTask = WebsocketMessageHelper.BroadcastMessage(WebsocketMessageHelper.WEBSOCKET_GROUP_TYPES.VISITOR, WebsocketMessageHelper.WEBSOCKET_COMMAND_TYPES.UPDATE_QUEUES); // To update all the queues
                            await Task.WhenAll(new List<Task>()
                            {
                                broadcastBoothAdminTask, broadbastVisitorTask
                            });
                            return Ok(queue);
                        }
                        else
                        {
                            return BadRequest($"Current Queue Status is {currentQueueStatus}. Please update queue to either PENDING COLLECTION to update this ticket to COLLECTED.");
                        }
                        break;
                    default:
                        return BadRequest($"Invalid Queue Status (QUEUE_STATUS_TO_UPDATE:{updateQueueInfo.QUEUE_STATUS_TO_UPDATE}). Please refer to documentation for list of valid values.");
                }
            }
            else
            {
                return NotFound($"No user with the Ticket Id: {updateQueueInfo.TicketId} found!");
            }

        }
    }
}
