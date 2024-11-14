using AWSServerless1.Authentication;
using AWSServerless1.DAL;
using AWSServerless1.DTO;
using AWSServerless1.WebSocket;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectEFEntities.OH25EntityModels;

namespace AWSServerless1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuperAdminVisitorUpdateController : ControllerBase
    {
        private IConfiguration _config;
        public SuperAdminVisitorUpdateController(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Remove the photo of for the Visitor.
        /// This method will REQUIRE Authentication and for role BOOTH HELPER OR ABOVE.
        /// </summary>
        /// <param name="updateDto"></param>
        /// <returns></returns>
        /// <response code="200">Photo removed</response>
        /// <response code="404">Ticket ID not found!</response>
        [HttpPut]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            , Roles = UserRolesProperties.CONTROLLER_USER_ROLES_BOOTH_HELPER_AND_ADMIN
            )]
        public async Task<IActionResult> UpdateVisitorInfo(SuperAdminVisitorUpdateDTO updateDto)
        {
            // Get the User of the TicketId
            var visitorEntity = VisitorDAL.GetVisitorByTicketId(updateDto.TicketId);
            if (visitorEntity != null)
            {
                visitorEntity = VisitorDAL.RemoveVisitorPhotoByVisitorId(visitorEntity.VisitorId);

                //sendDirectMessage("cartoonprofile." + photoExt, ticketId, "UPDATE_PHOTO");
                //broadcastMessage(ticketId, "MONTAGE", "UPDATE_PHOTOS");
                var taskMessageVisitor = WebsocketMessageHelper.SendDirectMessage($"{visitorEntity.TicketId}", WebsocketMessageHelper.WEBSOCKET_COMMAND_TYPES.REMOVE_PHOTO, "");
                var taskBroadcastToMontage = WebsocketMessageHelper.BroadcastMessage(WebsocketMessageHelper.WEBSOCKET_GROUP_TYPES.MONTAGE, WebsocketMessageHelper.WEBSOCKET_COMMAND_TYPES.REMOVE_PHOTO, $"{visitorEntity.TicketId}");
                await Task.WhenAll(new List<Task>() { taskMessageVisitor, taskBroadcastToMontage });

                return Ok($"Visitor (ticketId: {visitorEntity.TicketId}) photo have been removed.");
            }
            else
            {
                return NotFound($"No user with the Ticket Id: {updateDto.TicketId} found!");
            }

        }
    }
}
