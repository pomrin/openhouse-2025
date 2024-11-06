using AWSServerless1.Constants;
using AWSServerless1.DAL;
using AWSServerless1.DTO;
using AWSServerless1.WebSocket;
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
    public class MontageVisitorsController : ControllerBase
    {
        private IConfiguration _config;
        public MontageVisitorsController(IConfiguration config)
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
        [HttpGet]
        public async Task<IActionResult> GetAllVisitors(String apiKey = null)
        {
            var apiKeySetting = (String)_config[OHAPIAppSettings.APP_SETTINGS_KEY_API_SETTINGS_API_KEY];
            if (String.Compare(apiKey, apiKeySetting, false) == 0)
            {
                List<Visitor> listVisitorEntities = VisitorDAL.GetAllVisitors();
                var qToVisitorDTO = from q in listVisitorEntities
                                    select VisitorInfoDTO.FromVisitorEntity(q);
                return Ok(qToVisitorDTO.ToList());
            }
            else
            {
                return Unauthorized();
            }
        }
    }
}
