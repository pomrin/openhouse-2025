using AWSServerless1.Authentication;
using AWSServerless1.Constants;
using AWSServerless1.DAL;
using AWSServerless1.DTO;
using AWSServerless1.ResponseObject;
using AWSServerless1.WebSocket;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ProjectEFEntities.OH25EntityModels;
using System.Net.WebSockets;
using System.Text;
using System.Web.Http.Results;

namespace AWSServerless1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            , Roles = UserRolesProperties.CONTROLLER_USER_ROLES_BOOTH_HELPER_AND_ADMIN
            )]
    public class AdminIssueStampController : ControllerBase
    {
        private IConfiguration _config;
        public AdminIssueStampController(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Update the Visitor's Booth Status based on the input Visitor's Ticket ID and Booth ID.
        /// This method will REQUIRE Authentication and for role BOOTH HELPER OR ABOVE.
        /// </summary>
        /// <param name="stampDTO"></param>
        /// <returns></returns>
        /// <response code="200">Visitor Issued Stamp successfully.</response>
        /// <response code="404">No Visitor with Ticket ID or no booth with the Booth Id found.</response>
        /// <response code="409">Visitor have already been issued with the Stamp for the booth.</response>
        /// <response code="500">Unexpected Exception.</response>
        [HttpPut]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            , Roles = UserRolesProperties.CONTROLLER_USER_ROLES_BOOTH_HELPER_AND_ADMIN
            )]
        public async Task<IActionResult> UpdateBoothStampStatusForVisitor(IssueStampDTO stampDTO)
        {
            // Get the User of the TicketId
            var visitorEntity = VisitorDAL.GetVisitorByTicketId(stampDTO.TicketId);
            if (visitorEntity != null)
            {
                Booth boothEntity = BoothDAL.GetBoothByBoothId(stampDTO.BoothId);

                if (boothEntity != null)
                {
                    var existingRecords = VisitorBoothDAL.GetVisitorBoothVisited(visitorEntity.VisitorId);
                    var qExistingRecordOfBooth = from q in existingRecords
                                                 where q.BoothId == boothEntity.BoothId
                                                 select q;
                    if (qExistingRecordOfBooth != null && qExistingRecordOfBooth.Count() > 0)
                    {
                        Console.WriteLine($"Visitor (TicketID: {visitorEntity.TicketId} have already obtained a stamp for the Booth (BoothId: {boothEntity.BoothId} on {qExistingRecordOfBooth.First().DateVisited}.");
                        return Conflict($"Visitor (TicketID: {visitorEntity.TicketId} have already obtained a stamp for the Booth (BoothId: {boothEntity.BoothId} on {qExistingRecordOfBooth.First().DateVisited}.");
                    }
                    else
                    {
                        VisitorBooth result = VisitorBoothDAL.IssueOrUpdateVisitorBoothStamp(visitorEntity, boothEntity);
                        if (result != null)
                        {
                            //var responseMessage = await WebsocketMessageHelper.Ping();
                            var responseMessage2 = await WebsocketMessageHelper.SendDirectMessage(visitorEntity.TicketId, WebsocketMessageHelper.WEBSOCKET_MESSAGE_TYPES.UpdateStamp);

                            var visitorBoothResObj = VisitorBoothResObj.FromVisitorBoothEntity(result);
                            return Ok(visitorBoothResObj);
                        }
                        else
                        {
                            Console.WriteLine($"An Expected Error have occurred when trying to issue stamp to Visitor (TicketId: {stampDTO.TicketId}) for Booth (BoothId: {stampDTO.BoothId})");
                            return Problem($"An Expected Error have occurred when trying to issue stamp to Visitor (TicketId: {stampDTO.TicketId}) for Booth (BoothId: {stampDTO.BoothId})");
                        }
                    }
                }
                else
                {
                    return NotFound($"No Booth with the Booth Id: {stampDTO.BoothId} found!");
                }
            }
            else
            {
                return NotFound($"No user with the Ticket Id: {stampDTO.TicketId} found!");
            }
        }
    }
}
