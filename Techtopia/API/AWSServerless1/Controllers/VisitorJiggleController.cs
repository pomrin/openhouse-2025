using AWSServerless1.Constants;
using AWSServerless1.DAL;
using AWSServerless1.DTO;
using AWSServerless1.WebSocket;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AWSServerless1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitorJiggleController : ControllerBase
    {
        private IConfiguration _config;
        public VisitorJiggleController(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Sends a Jiggle Animation command to the OHMontage.
        /// This method will REQUIRE Authentication.
        /// </summary>
        /// <param name="option"></param>
        /// <returns></returns>
        /// <response code="200">Command received!</response>
        /// <response code="404">Ticket ID not found!</response>
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
           )]
        public async Task<IActionResult> Jiggle(int option = 1)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity.IsAuthenticated) // If user already have a valid jwt token, no need to do anything
            {
                // Get the User's ID or TicketID
                var ticketId = identity.FindFirst(OHAPIAppSettings.CLAIMS_KEY_TICKET_ID)?.Value;
                var visitorEntity = VisitorDAL.GetVisitorByTicketId(ticketId);
                if (visitorEntity == null)
                {
                    Console.WriteLine($"No user with the Ticket Id: {ticketId} found!");
                    return NotFound($"No user with the Ticket Id: {ticketId} found!");
                }
                else
                {
                    await WebsocketMessageHelper.BroadcastMessage(WebsocketMessageHelper.WEBSOCKET_GROUP_TYPES.MONTAGE, WebsocketMessageHelper.WEBSOCKET_COMMAND_TYPES.JIGGLE, ticketId); // To update all the queues
                    return Ok("Your wish is my command!");
                }
            }
            return Unauthorized();
        }
    }
}
