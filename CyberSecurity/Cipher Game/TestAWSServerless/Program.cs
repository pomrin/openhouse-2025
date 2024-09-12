// See https://aka.ms/new-console-template for more information
using ProjectEFEntities.DTO;
using System.Web;
using TestAWSServerless.Common;

Console.WriteLine("Hello, World!");

// TODO: Create the HTTPClient from SAS to test service
try
{
    var result = await HttpClientHelper.GetFromWebservice<List<UserDTO>>("user", new System.Collections.Specialized.NameValueCollection());


    var paramsBuilder = HttpUtility.ParseQueryString("");
    paramsBuilder["id"] = "cyl@mail.com";
    var result2 = await HttpClientHelper.GetFromWebservice<UserDTO>("user", paramsBuilder);


}
catch (Exception ex)
{
    var temp = ex;
    throw;
}

Console.WriteLine("End of World.");