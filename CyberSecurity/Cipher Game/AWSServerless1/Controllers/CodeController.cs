using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectEFEntities.OpenHouseEfModels;

namespace AWSServerless1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CodeController : ControllerBase
    {
        [HttpGet]
        public IEnumerable<Code> Get()
        {

            List<Code> result = new List<Code>();

            using (var context = new Openhouse24Context())
            {
                var qCode = from q in context.Codes
                            select q;
                if (qCode != null && qCode.Count() > 0)
                {
                    result.AddRange(qCode);
                }
            }

            return result;
        }
    }
}
