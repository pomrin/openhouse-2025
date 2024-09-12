using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace AWSServerless1.Pages
{
    public class IndexModel : PageModel
    {
        public string Message { get; private set; } = "PageModel in C#";

        public void OnGet()
        {
            Message += $" Server time is {DateTime.Now}";
            var testString = HttpContext.Session.GetString("Test String");
            if(!String.IsNullOrEmpty(testString))
            {
                Message += $" - Session Test String: {testString}";
            }
        }
    }
}
