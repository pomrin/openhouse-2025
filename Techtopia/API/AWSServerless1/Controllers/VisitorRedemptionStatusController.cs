using AWSServerless1.Authentication;
using AWSServerless1.Constants;
using AWSServerless1.DAL;
using AWSServerless1.DTO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AWSServerless1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitorRedemptionStatusController : ControllerBase
    {
        private IConfiguration _config;
        public VisitorRedemptionStatusController(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Returns the Redemption Status of the Visitor.
        /// This method will REQUIRE Authentication.
        /// </summary>
        /// <returns></returns>
        /// <response code="200">Visitor is eligible for redemption</response>
        /// <response code="400">Visitor not yet visited all required booths.</response>
        /// <response code="404">Ticket ID not found!</response>
        /// <response code="409">Visitor already redeemed before</response>
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            )]
        public IActionResult Get()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity.IsAuthenticated) // If user already have a valid jwt token, no need to do anything
            {
                // Get the User's ID or TicketID
                var ticketId = identity.FindFirst(OHAPIAppSettings.CLAIMS_KEY_TICKET_ID)?.Value;
                var controller = new AdminVisitorBoothController(_config);
                return controller.GetRedemptionStatus(ticketId);

            }
            return Unauthorized();
        }
    }
}
