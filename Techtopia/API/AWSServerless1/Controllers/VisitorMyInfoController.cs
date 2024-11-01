using AWSServerless1.Constants;
using AWSServerless1.DAL;
using AWSServerless1.DTO;
using AWSServerless1.ResponseObject;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectEFEntities.OH25EntityModels;
using System.Security.Claims;

namespace AWSServerless1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitorMyInfoController : ControllerBase
    {
        private IConfiguration _config;
        public VisitorMyInfoController(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Returns the Visitor Information based on the JWT Token.
        /// This method will REQUIRE Authentication.
        /// </summary>
        /// <returns></returns>
        /// <response code="200">Visitor Information</response>
        /// <response code="404">Ticket ID not found.</response>
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            )]
        public IActionResult GetVisitorInfo()
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
                    var result = VisitorInfoDTO.FromVisitorEntity(visitorEntity);
                    return Ok(result);
                }
            }
            return Unauthorized();
        }
    }
}
