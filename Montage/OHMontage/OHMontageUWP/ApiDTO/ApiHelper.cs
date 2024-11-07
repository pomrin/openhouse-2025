using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OHMontageUWP.ApiDTO
{


    public static class ApiHelper
    {
        public static readonly String API_MONTAGE_VISITORS = "MontageVisitors";
        public static readonly String API_MONTAGE_VISITORByTicketId = "MontageVisitorByTicketId";


        public static T DeserializeJson<T>(String jsonContent)
        {
            var reader = new JsonTextReader(new StringReader(jsonContent));
            var temp = new JsonSerializer().Deserialize<T>(reader);
            return temp;
        }

    }
}
