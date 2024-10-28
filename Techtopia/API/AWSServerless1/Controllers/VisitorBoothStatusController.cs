using AWSServerless1.Authentication;
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
    public class VisitorBoothStatusController : ControllerBase
    {
        private IConfiguration _config;
        public VisitorBoothStatusController(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Returns a list of Visitor's booth visit status based on the DateVisited.
        /// </summary>
        /// <returns></returns>
        /// <response code="200">Queue Status include Engraving, Pending Collection and Collected. If in Queue, includes a Queue Number</response>
        /// <response code="400">Bad Request</response>
        /// <response code="404">User Not in any queue.</response>
        /// <response code="500">Internal Server Error.</response>
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            )]
        public IActionResult GetVisitorBoothStatus(bool includeNotVisited = false)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity.IsAuthenticated) // If user already have a valid jwt token, no need to do anything
            {
                // Get the User's ID or TicketID
                var ticketId = identity.FindFirst(AMSAppSettings.CLAIMS_KEY_TICKET_ID)?.Value;
                var visitorEntity = VisitorDAL.GetVisitorByTicketId(ticketId);
                if (visitorEntity == null)
                {
                    Console.WriteLine($"No user with the Ticket Id: {ticketId} found!");
                    return NotFound($"No user with the Ticket Id: {ticketId} found!");
                }
                else
                {

                    List<VisitorBooth> listVisitorBoothEntities = VisitorBoothDAL.GetVisitorBoothStatus(visitorEntity, includeNotVisited);
                    if (listVisitorBoothEntities == null)
                    {
                        return Problem($"An unexpected problem have occured in GetVisitorBoothStatus for Visitor (ticketId: {ticketId}.");
                    }
                    else
                    {

                        //var listVisitorBoothEntity = VisitorBoothDAL.GetVisitorBoothVisited(visitorEntity.VisitorId);

                        List<VisitorBoothResObj> result = new List<VisitorBoothResObj>();
                        var qToVisitorResObj = from q in listVisitorBoothEntities
                                               select VisitorBoothResObj.FromVisitorBoothEntity(q);
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