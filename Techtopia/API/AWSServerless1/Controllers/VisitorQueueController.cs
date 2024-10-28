using AWSServerless1.Constants;
using AWSServerless1.DAL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using static AWSServerless1.Authentication.UserRolesProperties;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AWSServerless1.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace AWSServerless1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitorQueueController : ControllerBase
    {
        private IConfiguration _config;
        public VisitorQueueController(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Returns the user defined in the JWT token's Ticket Number Queue Status.
        /// This method will REQUIRE Authentication.
        /// </summary>
        /// <returns></returns>
        /// <response code="200">Queue Status include Engraving, Pending Collection and Collected. If in Queue, includes a Queue Number</response>
        /// <response code="400">Bad Request</response>
        /// <response code="404">User Not in any queue.</response>
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult Get()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity.IsAuthenticated) // If user already have a valid jwt token, no need to do anything
            {
                // Get the User's ID or TicketID
                var ticketId = identity.FindFirst(AMSAppSettings.CLAIMS_KEY_TICKET_ID)?.Value;
                var visitor = VisitorDAL.GetVisitorByTicketId(ticketId);
                if (visitor == null)
                {
                    return NotFound();
                }
                else
                {
                    var queueStatus = QueueDAL.GetQueueStatusVisitor(visitor.VisitorId);
                    switch (queueStatus)
                    {
                        case QueueDAL.QUEUE_STATUS.NOT_IN_QUEUE:
                            return NotFound();
                            break;
                        case QueueDAL.QUEUE_STATUS.IN_QUEUE:
                            var numberInfront = QueueDAL.GetQueueVisitor(visitor.VisitorId);
                            return Ok($"In Queue - {numberInfront}");
                            break;
                        case QueueDAL.QUEUE_STATUS.ENGRAVING:
                            return Ok("Engraving in process");

                        case QueueDAL.QUEUE_STATUS.PENDING_COLLECTION:
                            return Ok("Pending Collection");

                        case QueueDAL.QUEUE_STATUS.COLLECTED:
                            return Ok("Collected");
                        default:
                            return BadRequest();
                    }
                }
            }
            return Unauthorized();
        }
    }
}
