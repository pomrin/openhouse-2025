using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.ApplicationModel;

namespace OHMontageUWP
{
    public class AppConfig
    {
        private readonly IConfigurationRoot _configurationRoot;

        public AppConfig()
        {
            IConfigurationBuilder builder = new ConfigurationBuilder().SetBasePath(Package.Current.InstalledLocation.Path).AddJsonFile("appsettings.json", optional: false);

            _configurationRoot = builder.Build();
        }

        private T GetSection<T>(string key)
        {
            return _configurationRoot.GetSection(key).Get<T>();
        }

        public WebSocket GetWebSocketConfig()
        {
            return GetSection<WebSocket>(nameof(WebSocket));
        }
    }

    public class WebSocket
    {
        public String ProductionUrl { get; set; }
        public String AuthKey { get; set; }

    }
}
