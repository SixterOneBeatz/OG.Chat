using Microsoft.AspNetCore.Mvc;
using OG.Chat.Application.Common.Interfaces;
using Orleans;

namespace OG.Chat.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IClusterClient _clusterClient;
        public WeatherForecastController(ILogger<WeatherForecastController> logger, IClusterClient client)
        {
            _logger = logger;
            _clusterClient = client;
        }

        [HttpGet("GetWeatherForecast")]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        public record Hello(string Greeet, int Counter);

        [HttpGet("SayHello/{greet}")]
        public async Task<ActionResult<Hello>> SayHello(string greet)
        {
            var grain = _clusterClient.GetGrain<IHelloGrain>("Default");
            var greetResult = await grain.SayHello(greet);
            var greetCounter = await grain.GetGreets();
            return Ok(new Hello(greetResult, greetCounter));
        }
    }
}