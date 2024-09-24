// See https://aka.ms/new-console-template for more information

using System.Web;
using TestAWSServerless.Common;

Console.WriteLine("Hello, World!");

// TODO: Create the HTTPClient from SAS to test service
try
{
    var paramsBuilder = HttpUtility.ParseQueryString("");
    //paramsBuilder["userName"] = "RONNIEC";
    //paramsBuilder["password"] = "P@ssw0rd123";
    paramsBuilder["school"] = "P@ssw0rd123";
    var result3 = await HttpClientHelper.GetFromWebservice<List<BrandDTO>>("ItemBrand", paramsBuilder);


    //var result = await HttpClientHelper.PostToWebService<Object>("Login", new System.Collections.Specialized.NameValueCollection());

    var myResult = result3.ToString();
    //var result2 = await HttpClientHelper.GetFromWebservice<UserDTO>("user", paramsBuilder);


}
catch (Exception ex)
{
    var temp = ex;
    throw;
}

Console.WriteLine("End of World.");