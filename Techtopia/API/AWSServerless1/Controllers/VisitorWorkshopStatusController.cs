using AWSServerless1.Constants;
using AWSServerless1.DAL;
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
    public class VisitorWorkshopStatusController : ControllerBase
    {
        private IConfiguration _config;
        public VisitorWorkshopStatusController(IConfiguration config)
        {
            _config = config;
        }


        /// <summary>
        /// Returns a list of Visitor's Workshop completion status. Set IncludeNotVisited to true in include Workshop(s) not completed in result.
        /// This method will REQUIRE Authentication.
        /// </summary>
        /// <returns></returns>
        /// <response code="200">A list of Workshops and the visitor's completion status.</response>
        /// <response code="400">Bad Request</response>
        /// <response code="404">No user with the TicketID.</response>
        /// <response code="500">Internal Server Error.</response>
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            )]
        public IActionResult GetVisitorWorkshopCompletionStatus(bool includeNotVisited = false)
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

                    List<VisitorWorkshop> listVisitorBoothEntities = VisitorWorkshopDAL.GetVisitorWorkshopCompletionStatus(visitorEntity.VisitorId, includeNotVisited);
                    if (listVisitorBoothEntities == null)
                    {
                        return Problem($"An unexpected problem have occured in GetVisitorWorkshopCompletionStatus for Visitor (ticketId: {ticketId}, includeNotVisited: {includeNotVisited}).");
                    }
                    else
                    {

                        //var listVisitorBoothEntity = VisitorBoothDAL.GetVisitorBoothVisited(visitorEntity.VisitorId);

                        var result = new List<VisitorWorkshopResObj>();
                        var qToVisitorResObj = from q in listVisitorBoothEntities
                                               select VisitorWorkshopResObj.FromVisitorWorkShopEntity(q);
                        if (qToVisitorResObj != null && qToVisitorResObj.Count() > 0)
                        {
                            result.AddRange(qToVisitorResObj.ToList());
                        }
                        return Ok(result);
                    }
                }
            }
            return Unauthorized();
        }
    }
}
