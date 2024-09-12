using AWSServerless1.DTO;
using Microsoft.AspNetCore.Mvc;
namespace AWSServerless1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherController : ControllerBase
    {
        private static readonly string[] Summaries = new[] { "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching" };

        private readonly ILogger<WeatherController> _logger;

        public WeatherController(ILogger<WeatherController> logger)
        {
            _logger = logger;
        }

        [HttpGet("{id:int?}", Name = "GetWeatherForecast")]
        public IEnumerable<Weather> Get(int id, [System.Web.Http.FromUri] String? test)
        {
            return Enumerable.Range(1, 5).Select(index => new Weather
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        //// GET api/values/5
        //[HttpGet("{id}")]
        //public string Get(String id)
        //{
        //    return $"This is my id {id}";
        //}


    }
}
