using AWSServerless1.Authentication;
using AWSServerless1.DAL;
using AWSServerless1.DTO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace AWSServerless1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
        /// <param name="limit"></param>
        /// <returns></returns>
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            , Roles = UserRolesProperties.CONTROLLER_USER_ROLES_BOOTH_HELPER_AND_ADMIN
            )]
        public IActionResult Get(int limit = 1)
        {
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
        /// Add to Queue. Not yet implemented.
        /// This method will REQUIRE Authentication and for role BOOTH HELPER OR ABOVE.
        /// </summary>
        /// <param name="ticketId"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            , Roles = UserRolesProperties.CONTROLLER_USER_ROLES_BOOTH_HELPER_AND_ADMIN
            )]
        public IActionResult AddToQueue(int ticketId)
        {
            return BadRequest("Not Implemented Yet.");
        }
    }
}
