using AWSServerless1.Constants;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using static AWSServerless1.Authentication.UserRolesProperties;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AWSServerless1.DAL;
using Microsoft.AspNetCore.Http.Extensions;
using AWSServerless1.Authentication;
using AWSServerless1.DTO;

namespace AWSServerless1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private IConfiguration _config;
        public RegisterController(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Visitor sign in.
        /// Call this to get a JWT token that is valid for 3 days to access other parts of this API.
        /// </summary>
        /// <returns>
        /// </returns>
        /// <response code="200">User already registered</response>
        /// <response code="201">Registration successful</response>
        /// <response code="401">Registration unsuccessful</response>
        [HttpPost]
        public IActionResult Post()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity != null && identity.IsAuthenticated) // If user already have a valid jwt token, no need to do anything
            {
                return Ok($"User ({identity.Name}) is already signed in.");
            }
            else // if user does not have a valid jwt token, register a new one and return the jwt token
            {
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config[AMSAppSettings.APP_SETTINGS_KEY_JWT_KEY]));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var visitorEntity = VisitorDAL.RegisterVisitor();

                var Sectoken = new JwtSecurityToken(
                        issuer: _config[AMSAppSettings.APP_SETTINGS_KEY_JWT_ISSUER],
                        audience: _config[AMSAppSettings.APP_SETTINGS_KEY_JWT_ISSUER],
                        claims: new Claim[]
                        {
                            new Claim(ClaimTypes.Name, visitorEntity.TicketId),
                            new Claim(ClaimTypes.Role, USER_ROLES.VISITOR.ToDescriptionString()),
                            new Claim(AMSAppSettings.CLAIMS_KEY_STAFF, JsonConvert.SerializeObject(new VisitorInfoDTO(){
                                TicketId = visitorEntity.TicketId,
                                VisitorId = visitorEntity.VisitorId,
                                Datecreated = DateTime.UtcNow,
                            })),
                            new Claim(AMSAppSettings.CLAIMS_KEY_TICKET_ID, visitorEntity.TicketId),
                            //new Claim(AMSAppSettings.CLAIMS_KEY_SCHOOL, school),
                            //new Claim("MoreKey", "MoreValue"),
                        },
                        notBefore: DateTime.Now,
                        expires: DateTime.Now.AddMinutes(4320), // 3 days of validity
                        signingCredentials: credentials);

                var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);
                return Created(new Uri(Request.GetEncodedUrl()), token);
            }


            //bool result = this.Login(pData.UserName, pData.Password);
            //// TODO: To return JWT token then add [Authorize] tag for other functions.
            ////If login usrename and password are correct then proceed to generate token
            //if (result)
            //{
            //    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config[AMSAppSettings.APP_SETTINGS_KEY_JWT_KEY]));
            //    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            //    // TODO: Get the school from the user name
            //    var school = "TODO";

            //    var staff = StaffDAL.GetStaffByLoginName(school, pData.UserName);

            //    StaffDTO staffDTO = null;
            //    if (staff != null)
            //    {
            //        staffDTO = new StaffDTO()
            //        {
            //            StaffId = staff.StaffId,
            //            StaffName = staff.StaffName,
            //            Email = staff.Email,
            //            Disabled = staff.Disabled == 0 ? false : true,
            //            LastLogin = staff.LastLogin,
            //            LoginName = staff.LoginName,
            //            RoleId = staff.RoleId,
            //            USER_ROLE = (USER_ROLES)staff.RoleId
            //        };
            //    }
            //    else
            //    {
            //        return NotFound($"No user found for Staff LoginName {pData.UserName}");
            //    }

            //    if (staffDTO != null && !staffDTO.Disabled)
            //    {
            //        var Sectoken = new JwtSecurityToken(
            //            issuer: _config[AMSAppSettings.APP_SETTINGS_KEY_JWT_ISSUER],
            //            audience: _config[AMSAppSettings.APP_SETTINGS_KEY_JWT_ISSUER],
            //            claims: new Claim[]
            //            {
            //            new Claim(ClaimTypes.Name, staffDTO.LoginName),
            //            new Claim(ClaimTypes.Role, staffDTO.USER_ROLE.ToDescriptionString()),
            //            new Claim(AMSAppSettings.CLAIMS_KEY_STAFF, JsonConvert.SerializeObject(staffDTO)),
            //            new Claim(AMSAppSettings.CLAIMS_KEY_SCHOOL, school),
            //                //new Claim("MoreKey", "MoreValue"),
            //            },
            //            notBefore: DateTime.Now,
            //            expires: DateTime.Now.AddMinutes(120),
            //            signingCredentials: credentials);

            //        var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);
            //        return Ok(token);
            //    }
            //}
            return Unauthorized();
        }
    }
}
