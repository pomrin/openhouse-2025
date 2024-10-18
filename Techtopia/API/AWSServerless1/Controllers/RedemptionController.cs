using AWSServerless1.Authentication;
using AWSServerless1.DAL;
using AWSServerless1.DTO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using ProjectEFEntities.OH25EntityModels;

namespace AWSServerless1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            , Roles = UserRolesProperties.CONTROLLER_USER_ROLES_BOOTH_HELPER_AND_ADMIN
            )]
    public class RedemptionController : ControllerBase
    {
        private IConfiguration _config;
        public RedemptionController(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Update a Visitor's redemption status.
        /// This method will REQUIRE Authentication and for role BOOTH HELPER OR ABOVE.
        /// </summary>
        /// <param name="redemptionInfo"></param>
        /// <returns></returns>
        /// <response code="200">Successfully redeemed</response>
        /// <response code="400">Missing parameter or invalid Luggage color or cisitor not yet visited all required booths.</response>
        /// <response code="404">Ticket ID not found!</response>
        /// <response code="409">Visitor already redeemed before</response>
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            , Roles = UserRolesProperties.CONTROLLER_USER_ROLES_BOOTH_HELPER_AND_ADMIN
            )]
        public IActionResult Redeem(AdminRedemptionDTO redemptionInfo)
        {
            // Get the User of the TicketId
            var visitorEntity = VisitorDAL.GetVisitorByTicketId(redemptionInfo.TicketId);
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
                        var luggageTagColor = LuggageTagColorDAL.GetLuggageTagColorByName(redemptionInfo.LuggageTagColor);
                        if (luggageTagColor != null)
                        {
                            Visitor visitor = VisitorDAL.RedeemLuggageTag(visitorEntity.VisitorId, luggageTagColor);
                            return Ok(visitor);
                        }
                        else
                        {
                            return BadRequest($"Invalid Luggage Tag Name - {redemptionInfo.LuggageTagColor}");
                        }
                    }
                }
                else
                {
                    return BadRequest($"Visitor have visited {boothVisited.Count()} booths but is required to visit {totalBooth.Count()} booths.");
                }
            }
            else
            {
                return NotFound($"No user with the Ticket Id: {redemptionInfo.TicketId} found!");
            }
        }

        /// <summary>
        /// Create or Update a redemption information.
        /// This method will REQUIRE Authentication and for role BOOTH HELPER OR ABOVE.
        /// </summary>
        /// <param name="redemptionInfo"></param>
        /// <returns></returns>
        /// <response code="200">Successfully update redemption information or inserted the redemption</response>
        /// <response code="400">Missing parameter or invalid Luggage color.</response>
        /// <response code="404">Ticket ID not found!</response>
        [HttpPut]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            , Roles = UserRolesProperties.CONTROLLER_USER_ROLES_BOOTH_HELPER_AND_ADMIN
            )]
        public IActionResult UpdateRedemption(AdminRedemptionDTO redemptionInfo)
        {
            // Get the User of the TicketId
            var visitorEntity = VisitorDAL.GetVisitorByTicketId(redemptionInfo.TicketId);
            if (visitorEntity != null)
            {
                var luggageTagColor = LuggageTagColorDAL.GetLuggageTagColorByName(redemptionInfo.LuggageTagColor);
                if (luggageTagColor != null)
                {

                    if (visitorEntity.LuggageRedeemedDate != null)
                    {
                        Visitor visitor = VisitorDAL.UpdateRedemptionInformation(visitorEntity.VisitorId, luggageTagColor);
                        return Ok(visitor);
                    }
                    else
                    {
                        var boothVisited = VisitorBoothDAL.GetVisitorBoothVisited(visitorEntity.VisitorId);
                        var totalBooth = BoothDAL.GetAllBooths();

                        if (boothVisited.Count() == totalBooth.Count())
                        {
                            Visitor visitor = VisitorDAL.RedeemLuggageTag(visitorEntity.VisitorId, luggageTagColor);
                            return Ok(visitor);
                        }
                        else
                        {
                            return BadRequest($"Visitor have visited {boothVisited.Count()} booths but is required to visit {totalBooth.Count()} booths.");
                        }
                    }
                }
                else
                {
                    return BadRequest($"Invalid Luggage Tag Name - {redemptionInfo.LuggageTagColor}");
                }
            }
            else
            {
                return NotFound($"No user with the Ticket Id: {redemptionInfo.TicketId} found!");
            }
        }
    }
}
