using AWSServerless1.Constants;
using AWSServerless1.DAL;
using AWSServerless1.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectEFEntities.OH25EntityModels;

namespace AWSServerless1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MontageVisitorByTicketIdController : ControllerBase
    {
        private IConfiguration _config;
        public MontageVisitorByTicketIdController(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Returns a list of visitors' non-sensitive information.
        /// </summary>
        /// <param name="apiKey"></param>
        /// <returns></returns>
        /// <response code="200">Successful</response>
        /// <response code="401">Invalid API Key.</response>
        /// <response code="404">No user with  Ticket Id Found!</response>
        [HttpGet]
        public async Task<IActionResult> GetVisitorByTicketId(String ticketId, String apiKey = null)
        {
            var apiKeySetting = (String)_config[OHAPIAppSettings.APP_SETTINGS_KEY_API_SETTINGS_API_KEY];
            if (String.Compare(apiKey, apiKeySetting, false) == 0)
            {
                var visitorEntity = VisitorDAL.GetVisitorByTicketId(ticketId);
                if (visitorEntity != null)
                {
                    var qToVisitorDTO = VisitorInfoDTO.FromVisitorEntity(visitorEntity);
                    return Ok(qToVisitorDTO);
                }
                else
                {
                    return NotFound();
                }
            }
            else
            {
                return Unauthorized();
            }
        }
    }
}
