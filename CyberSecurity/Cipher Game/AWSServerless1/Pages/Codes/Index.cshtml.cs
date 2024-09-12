using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace AWSServerless1.Pages.Codes
{
    public class IndexModel : PageModel
    {
        public string Message { get; private set; } = "2nd Page in C#";

        public void OnGet()
        {
            Message += $" Server time is {DateTime.Now}";
        }

        public IActionResult OnPost()
        {
            var emailAddress = Request.Form["emailaddress"];
            // do something with emailAddress
            Console.Write("here!");
            HttpContext.Session.SetString("Test String", $"{emailAddress}");


            return Redirect("/");
        }
    }
}
