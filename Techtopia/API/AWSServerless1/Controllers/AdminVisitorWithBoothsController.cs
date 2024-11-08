using AWSServerless1.Authentication;
using AWSServerless1.DAL;
using AWSServerless1.DTO;
using AWSServerless1.ResponseObject;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AWSServerless1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminVisitorWithBoothsController : ControllerBase
    {
        private IConfiguration _config;
        public AdminVisitorWithBoothsController(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Returns a list of Visitor Information together with their Booth's Visited information. Use limit to set the number of visitor records to return.
        /// This method will REQUIRE Authentication and for role BOOTH HELPER OR ABOVE.
        /// </summary>
        /// <param name="limit"></param>
        /// <returns></returns>
        /// <response code="200">Ok</response>
        /// <response code="404">No data to return</response>
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            , Roles = UserRolesProperties.CONTROLLER_USER_ROLES_BOOTH_HELPER_AND_ADMIN
         )]
        public IActionResult GetAllVisitorAndVisitorBooths(int limit = 0)
        {
            // Get the Visitor of the TicketId
            var listVisitorEntities = VisitorDAL.GetAllVisitorsIncludeVisitorBooths(limit);
            if (listVisitorEntities != null)
            {

                var qToResObj = from q in listVisitorEntities
                                select VisitorWithBoothResObj.FromVisitorEntity(q);

                return Ok(qToResObj.ToList());
            }
            else
            {
                return NotFound($"");
            }
        }
    }
}
