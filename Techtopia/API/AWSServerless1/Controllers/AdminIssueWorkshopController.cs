using AWSServerless1.Authentication;
using AWSServerless1.DAL;
using AWSServerless1.DTO;
using AWSServerless1.ResponseObject;
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
    public class AdminIssueWorkshopController : ControllerBase
    {
        private IConfiguration _config;
        public AdminIssueWorkshopController(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Create or Update a Visitor's Workshop completion status.
        /// This method will REQUIRE Authentication and for role BOOTH HELPER OR ABOVE.
        /// </summary>
        /// <param name="stampDTO"></param>
        /// <returns></returns>
        /// <response code="200">Visitor Workshop Completion Updated successfully.</response>
        /// <response code="404">No Visitor with Ticket ID or no workshop with the Booth Id found.</response>
        /// <response code="409">Visitor have already completed the Workshop previously.</response>
        /// <response code="500">Unexpected Exception.</response>
        [HttpPut]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            , Roles = UserRolesProperties.CONTROLLER_USER_ROLES_BOOTH_HELPER_AND_ADMIN
            )]
        public async Task<IActionResult> UpdateWorkshopStampStatusForVisitor(IssueWorkshopStampDTO stampDTO)
        {
            // Get the User of the TicketId
            var visitorEntity = VisitorDAL.GetVisitorByTicketId(stampDTO.TicketId);
            if (visitorEntity != null)
            {
                var workshopEntity = WorkshopDAL.GetWorkshopByWorkshopId(stampDTO.WorkshopId);

                if (workshopEntity != null)
                {
                    var existingRecords = VisitorWorkshopDAL.GetVisitorWorkshopCompleted(visitorEntity.VisitorId);
                    var qExistingRecordOfBooth = from q in existingRecords
                                                 where q.WorkshopId == workshopEntity.WorkshopId
                                                 select q;
                    if (qExistingRecordOfBooth != null && qExistingRecordOfBooth.Count() > 0)
                    {
                        Console.WriteLine($"Visitor (TicketID: {visitorEntity.TicketId} have already obtained a stamp for the Workshop (WorkshopId: {workshopEntity.WorkshopId}, WorkshopName: {workshopEntity.WorkshopDescription} on {qExistingRecordOfBooth.First().DateCompleted}.");
                        return Conflict($"Visitor (TicketID: {visitorEntity.TicketId} have already obtained a stamp for the Workshop (WorkshopId: {workshopEntity.WorkshopId}, WorkshopName: {workshopEntity.WorkshopDescription} on {qExistingRecordOfBooth.First().DateCompleted}.");
                    }
                    else
                    {
                        var result = VisitorWorkshopDAL.IssueOrUpdateVisitorWorkshopCompletionStatus(visitorEntity, workshopEntity);
                        if (result != null)
                        {
                            //var responseMessage = await WebsocketMessageHelper.Ping();
                            var responseMessage2 = await WebsocketMessageHelper.SendDirectMessage(visitorEntity.TicketId, WebsocketMessageHelper.WEBSOCKET_COMMAND_TYPES.UPDATE_WORKSHOP, $"{workshopEntity.WorkshopId}");

                            var visitorWorkshopResObj = VisitorWorkshopResObj.FromVisitorWorkShopEntity(result);

                            Console.WriteLine($"Successfully updated Visitor (TicketID: {visitorEntity.TicketId} workshop completion status for Workshop (WorkshopId: {workshopEntity.WorkshopId}, WorkshopName: {workshopEntity.WorkshopDescription} on {result.DateCompleted}.");

                            return Ok(visitorWorkshopResObj);
                        }
                        else
                        {
                            Console.WriteLine($"An Expected Error have occurred when trying to update workshop complete status to Visitor (TicketId: {stampDTO.TicketId}) for Workshop(WorkshopId: {stampDTO.WorkshopId})");
                            return Problem($"An Expected Error have occurred when trying to update workshop complete status to Visitor (TicketId: {stampDTO.TicketId}) for Workshop (WorkshopId: {stampDTO.WorkshopId})");
                        }
                    }
                }
                else
                {
                    return NotFound($"No Workshop with the Workshop Id: {stampDTO.WorkshopId} found!");
                }
            }
            else
            {
                return NotFound($"No user with the Ticket Id: {stampDTO.TicketId} found!");
            }
        }
    }
}
