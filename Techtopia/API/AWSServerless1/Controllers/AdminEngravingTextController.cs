using AWSServerless1.Authentication;
using AWSServerless1.DAL;
using AWSServerless1.DTO;
using AWSServerless1.WebSocket;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectEFEntities.OH25EntityModels;

namespace AWSServerless1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminEngravingTextController : ControllerBase
    {
        private IConfiguration _config;
        public AdminEngravingTextController(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Update the engraving text for a engraving queue. Only queue that is still in the queue and not in engraving, pending collection or collected can be updated.
        /// This method will REQUIRE Authentication and for role BOOTH HELPER OR ABOVE.
        /// </summary>
        /// <param name="adminEngravingTextDTO"></param>
        /// <returns></returns>
        /// <response code="200">Engraving Text Updated!</response>
        /// <response code="400">Not valid for update</response>
        /// <response code="404">Ticket ID not found!</response>
        /// <response code="500">Updated failed.</response>
        [HttpPut]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            , Roles = UserRolesProperties.CONTROLLER_USER_ROLES_BOOTH_HELPER_AND_ADMIN
            )]
        public async Task<IActionResult> UpdateEngravingText(AdminEngravingTextDTO adminEngravingTextDTO)
        {
            // Get the User of the TicketId
            var visitorEntity = VisitorDAL.GetVisitorByTicketId(adminEngravingTextDTO.TicketId);
            if (visitorEntity != null)
            {
                var currentQueueStatus = QueueDAL.GetQueueStatusVisitor(visitorEntity.VisitorId);
                EngravingQueue queue = null;
                switch (currentQueueStatus)
                {
                    case QueueDAL.QUEUE_STATUS.IN_QUEUE:
                        // Update the Engraving text
                        queue = QueueDAL.UpdateEngravingText(visitorEntity.VisitorId, adminEngravingTextDTO.EngravingText);
                        if (queue != null)
                        {
                            // Broadcast message to update the queue
                            var broadcastAdminTask = await WebsocketMessageHelper.BroadcastMessage(WebsocketMessageHelper.WEBSOCKET_GROUP_TYPES.BOOTHADMIN, WebsocketMessageHelper.WEBSOCKET_COMMAND_TYPES.UPDATE_QUEUES); // To update all the queues
                            return Ok(queue);
                        }
                        else
                        {
                            return Problem("Update failed.");
                        }
                        break;
                    case QueueDAL.QUEUE_STATUS.NOT_IN_QUEUE:
                    case QueueDAL.QUEUE_STATUS.ENGRAVING:
                    case QueueDAL.QUEUE_STATUS.PENDING_COLLECTION:
                    case QueueDAL.QUEUE_STATUS.COLLECTED:
                        return BadRequest($"Ticket status ({currentQueueStatus}) either does not or no longer allow for update of engraving text.");
                        break;
                    default:
                        return BadRequest($"Invalid Parameters UpdateEngravingText(TicketId: {adminEngravingTextDTO.TicketId}, Engraving Text: {adminEngravingTextDTO.EngravingText}).");
                }
            }
            else
            {
                return NotFound($"No user with the Ticket Id: {adminEngravingTextDTO.TicketId} found!");
            }

        }
    }
}
