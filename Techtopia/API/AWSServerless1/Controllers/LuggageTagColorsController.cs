using AWSServerless1.Authentication;
using AWSServerless1.DAL;
using AWSServerless1.ResponseObject;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AWSServerless1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LuggageTagColorsController : ControllerBase
    {
        private IConfiguration _config;
        public LuggageTagColorsController(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Returns the list of Luggage Tag Colors in the system with the corresponding color codes.
        /// This method will REQUIRE Authentication and for role BOOTH HELPER OR ABOVE.
        /// 
        /// </summary>
        /// <returns></returns>
        /// <response code="200">Ok</response>
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme
            , Roles = UserRolesProperties.CONTROLLER_USER_ROLES_BOOTH_HELPER_AND_ADMIN
            )]
        public IActionResult GetLuggageTagColors()
        {
            var luggageTagColorsEntities = LuggageTagColorDAL.GetAllTagColors();
            List<LuggageTagColorsResObj> result = new List<LuggageTagColorsResObj>();
            var qToResponseObject = from q in luggageTagColorsEntities
                                    select LuggageTagColorsResObj.FromLuggageTagColorsEntities(q);
            if (qToResponseObject != null)
            {
                result.AddRange(qToResponseObject.ToList());
            }
            return Ok(result);
        }
    }
}
