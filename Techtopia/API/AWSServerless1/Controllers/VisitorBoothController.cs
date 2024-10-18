using AWSServerless1.Authentication;
using AWSServerless1.DAL;
using AWSServerless1.DTO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectEFEntities.OH25EntityModels;

namespace AWSServerless1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitorBoothController : ControllerBase
    {
        private IConfiguration _config;
        public VisitorBoothController(IConfiguration config)
        {
            _config = config;
        }


        /// <summary>
        /// Returns the Eligibility of the Visitor for Luggage Tag redemption.
        /// </summary>
        /// <param name="ticketId"></param>
        /// <returns></returns>
        /// <response code="200">Visitor is eligible for redemption</response>
        /// <response code="400">Visitor not yet visited all required booths.</response>
        /// <response code="404">Ticket ID not found!</response>
        /// <response code="409">Visitor already redeemed before</response>
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            , Roles = UserRolesProperties.CONTROLLER_USER_ROLES_BOOTH_HELPER_AND_ADMIN
            )]
        public IActionResult GetRedemptionStatus(String ticketId)
        {
            // Get the User of the TicketId
            var visitorEntity = VisitorDAL.GetVisitorByTicketId(ticketId);
            if (visitorEntity != null)
            {
                var boothVisited = VisitorBoothDAL.GetVisitorBoothVisited(visitorEntity.VisitorId);
                var totalBooth = BoothDAL.GetAllBooths();

                if (boothVisited.Count() == totalBooth.Count())
                {
                    if (visitorEntity.LuggageRedeemedDate != null)
                    {
                        Console.WriteLine($"Visitor have already redeemed a luggage tag on {visitorEntity.LuggageRedeemedDate.Value.ToString("yyyy-MM-dd HHmmss")}");
                        return Conflict($"Visitor have already redeemed a luggage tag on {visitorEntity.LuggageRedeemedDate.Value.ToString("yyyy-MM-dd HHmmss")}");
                    }
                    else
                    {
                        return Ok($"Visitor is Eligible for luggage tag redemption.");
                    }
                }
                else
                {
                    return BadRequest($"Visitor have visited {boothVisited.Count()} booths but is required to visit {totalBooth.Count()} booths.");
                }
            }
            else
            {
                return NotFound($"No user with the Ticket Id: {ticketId} found!");
            }
        }
    }
}
