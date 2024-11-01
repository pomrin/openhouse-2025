using AWSServerless1.Authentication;
using AWSServerless1.DAL;
using AWSServerless1.DTO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AWSServerless1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminVisitorController : ControllerBase
    {
        private IConfiguration _config;
        public AdminVisitorController(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Return the visitor information with the input ticket id.
        /// This method will REQUIRE Authentication and for role BOOTH HELPER OR ABOVE.
        /// </summary>
        /// <param name="ticketId"></param>
        /// <returns></returns>
        /// <response code="200">Visitor Found</response>
        /// <response code="404">No Visitor with the Input ID Found</response>
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            , Roles = UserRolesProperties.CONTROLLER_USER_ROLES_BOOTH_HELPER_AND_ADMIN
            )]
        public IActionResult GetVisitorByTicketId(String ticketId)
        {
            // Get the Visitor of the TicketId
            var visitorEntity = VisitorDAL.GetVisitorByTicketId(ticketId);
            if (visitorEntity != null)
            {
                VisitorInfoDTO result = VisitorInfoDTO.FromVisitorEntity(visitorEntity);
                return Ok(result);
            }
            else
            {
                return NotFound($"No visitor with the Ticket Id: {ticketId} found!");
            }
        }
    }
}
