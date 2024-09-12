using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;


namespace TestAWSServerless.Common
{
    internal class HttpClientHelper
    {
        private static readonly string clientURL = @"https://cqb7ae2531.execute-api.ap-southeast-1.amazonaws.com/Prod/";

        public static async Task<T> GetFromWebservice<T>(String apiName, NameValueCollection paramsBuilder)
        {
            T result = default;
            var clientAddress = clientURL;
            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(clientAddress);
                    var paramsString = paramsBuilder.ToString();

                    var responseTask = client.GetAsync(apiName + "?" + paramsString);
                    responseTask.Wait();

                    var resResult = responseTask.Result;
                    if (resResult.IsSuccessStatusCode)
                    {
                        var stream = await resResult.Content.ReadAsStreamAsync();
                        var readTask = await JsonSerializer.DeserializeAsync<T>(stream);
                        if (readTask != null)
                        {
                            result = readTask;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //SAS3WSLogger.Logger.Error("An error have occurred in GetFromOracleWSV2(clientAddress: " + clientAddress + ", apiName: " + apiName + ", paramsBuilder:" + paramsBuilder.ToString() + ", T: " + typeof(T) + ")" + ex.Message + "\n" + ex.StackTrace);
                throw ex;
            }
            return result;
        }

        public static async Task<T> PostToWebService<T>(String apiName, NameValueCollection paramsBuilder)
        {
            T result = default;
            var clientAddress = clientURL;
            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(clientAddress);
                    var paramsString = paramsBuilder.ToString();

                    var responseTask = client.GetAsync(apiName);
                    responseTask.Wait();

                    var resResult = responseTask.Result;
                    if (resResult.IsSuccessStatusCode)
                    {
                        var stream = await resResult.Content.ReadAsStreamAsync();
                        var readTask = await JsonSerializer.DeserializeAsync<T>(stream);
                        if (readTask != null)
                        {
                            result = readTask;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //SAS3WSLogger.Logger.Error("An error have occurred in GetFromOracleWSV2(clientAddress: " + clientAddress + ", apiName: " + apiName + ", paramsBuilder:" + paramsBuilder.ToString() + ", T: " + typeof(T) + ")" + ex.Message + "\n" + ex.StackTrace);
                throw ex;
            }
            return result;
        }



        //public static T GetFromOracleWSV2<T>(String apiName, NameValueCollection paramsBuilder)
        //{
        //    Object methodReturn = null;
        //    var clientAddress = SAS3WSConstants.GetOracleWSV2URL();
        //    try
        //    {
        //        using (var client = new HttpClient())
        //        {
        //            client.BaseAddress = new Uri(clientAddress);
        //            var paramsString = paramsBuilder.ToString();

        //            var responseTask = client.GetAsync(apiName + "?" + paramsString);
        //            responseTask.Wait();

        //            var result = responseTask.Result;
        //            if (result.IsSuccessStatusCode)
        //            {

        //                var readTask = result.Content.ReadAsAsync<T>();
        //                readTask.Wait();

        //                var tempResult = readTask.Result;
        //                methodReturn = tempResult;
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        SAS3WSLogger.Logger.Error("An error have occurred in GetFromOracleWSV2(clientAddress: " + clientAddress + ", apiName: " + apiName + ", paramsBuilder:" + paramsBuilder.ToString() + ", T: " + typeof(T) + ")" + ex.Message + "\n" + ex.StackTrace);
        //        throw ex;
        //    }
        //    return (T)methodReturn;
        //}
    }
}
