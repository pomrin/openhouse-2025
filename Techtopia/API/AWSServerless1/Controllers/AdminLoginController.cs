using AWSServerless1.Authentication;
using AWSServerless1.Constants;
using AWSServerless1.DAL;
using AWSServerless1.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using ProjectEFEntities.OH25EntityModels;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static AWSServerless1.Authentication.UserRolesProperties;

namespace AWSServerless1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminLoginController : ControllerBase
    {
        private IConfiguration _config;
        public AdminLoginController(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Login for Booth Helper and Administrator.
        /// This method will REQUIRE Authentication.
        /// </summary>
        /// <param name="userData"></param>
        /// <returns>
        /// </returns>
        /// <response code="200">Successfully logged in</response>
        /// <response code="400">Missing Fields in Request</response>
        /// <response code="401">Invalid login due to wrong username and/or password</response>
        [HttpPost]
        public IActionResult Post(AdminLoginDTO userData)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            Visitor visitorEntity = null;
            if (identity.IsAuthenticated) // If user already have a valid jwt token, no need to do anything
            {
                var ticketId = identity.FindFirst(OHAPIAppSettings.CLAIMS_KEY_TICKET_ID)?.Value;
                if (!String.IsNullOrEmpty(ticketId))
                {
                    visitorEntity = VisitorDAL.GetVisitorByTicketId(ticketId);
                }
            }
            if (visitorEntity == null)
            {
                visitorEntity = VisitorDAL.RegisterVisitor();
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config[OHAPIAppSettings.APP_SETTINGS_KEY_JWT_KEY]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            if (userData != null && !String.IsNullOrEmpty(userData.UserName) && !String.IsNullOrEmpty(userData.Password))
            {
                User userEntity = UserDAL.Login(userData.UserName, userData.Password);
                if (userEntity != null)
                {
                    var Sectoken = new JwtSecurityToken(
                            issuer: _config[OHAPIAppSettings.APP_SETTINGS_KEY_JWT_ISSUER],
                            audience: _config[OHAPIAppSettings.APP_SETTINGS_KEY_JWT_ISSUER],
                            claims: new Claim[]
                            {
                                new Claim(ClaimTypes.Name, userEntity.UserName),
                                new Claim(ClaimTypes.Role, USER_ROLES.BOOTH_HELPER.ToDescriptionString()),
                                new Claim(OHAPIAppSettings.CLAIMS_KEY_STAFF, JsonConvert.SerializeObject(new VisitorInfoDTO(){
                                    TicketId = visitorEntity.TicketId,
                                    VisitorId = visitorEntity.VisitorId,
                                    Datecreated = DateTime.UtcNow,
                                })),
                                new Claim(OHAPIAppSettings.CLAIMS_KEY_TICKET_ID, String.IsNullOrEmpty(visitorEntity.TicketId)?"":visitorEntity.TicketId),
                                //new Claim("MoreKey", "MoreValue"),
                            },
                            notBefore: DateTime.Now,
                            expires: DateTime.Now.AddMinutes(1440), // 1 day of validity
                            signingCredentials: credentials);

                    var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);
                    return Ok(token);
                }
                else
                {
                    Console.WriteLine("Failed to login.");
                    return Unauthorized("Invalid login.");
                }
            }
            return BadRequest("Invalid login.");
        }
    }
}
