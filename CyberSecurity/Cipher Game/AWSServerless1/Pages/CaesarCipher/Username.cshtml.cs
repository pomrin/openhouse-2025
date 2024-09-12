using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ProjectEFEntities.OpenHouseEfModels;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace AWSServerless1.Pages.CaesarCipher
{
    public class UsernameModel : PageModel
    {
        public string Answer { get; set; }
        public double TimeTaken { get; set; }
        public string DecryptedMessage { get; set; }

        [BindProperty]
        public string UserName { get; set; }

        public void OnGet(string answer, double timetaken, string decryptedMessage)
        {
            Answer = answer;
            TimeTaken = timetaken;
            DecryptedMessage = decryptedMessage;
            Debug.WriteLine("CHECK ONGET ANSWER: " + answer);


            // Save values to session
            
            HttpContext.Session.SetString("UserAnswer", answer);
            HttpContext.Session.SetString("TimeTaken", timetaken.ToString());
            HttpContext.Session.SetString("DecryptedMessage", decryptedMessage);
           
        }

        public async Task<IActionResult> OnPostAsync()
        {
           
            if (!ModelState.IsValid)
            {
                foreach (var modelStateKey in ModelState.Keys)
                {
                    var modelStateVal = ModelState[modelStateKey];
                    foreach (var error in modelStateVal.Errors)
                    {
                        // Log error messages
                        Debug.WriteLine($"{modelStateKey}: {error.ErrorMessage}");
                    }
                }

                TempData["Message"] = "Please enter valid data!";
                return RedirectToPage("./Username");
            }

            // Retrieve values from session
            var userAnswer = HttpContext.Session.GetString("UserAnswer");
            var timeTaken = Convert.ToDouble(HttpContext.Session.GetString("TimeTaken"));
            var decryptedMessage = HttpContext.Session.GetString("DecryptedMessage");
            Debug.WriteLine("UserAnswer" + userAnswer);

            // Add a new record to the HighScore table
            using (var _context = new Openhouse24Context())
            {


           

                if (_context != null)
                {
                    var newHighScore = new Highscore
                    {
                        
                        Username = UserName,
                        Timetaken = timeTaken,
                        Answer = userAnswer,
                        Codes = decryptedMessage
                      
                     
                        
                    
                };
                   

                    _context.Highscores.Add(newHighScore);
                    await _context.SaveChangesAsync();

                    // Retrieve the user ID associated with the username
                    //Added in OrderByDescending on line 93 to filter the duplicate users with same name by latest datetime first
                    var userId = await _context.Highscores

                        .Where(u => u.Username == UserName)
                        .OrderByDescending(u => u.Datecreated)
                        .Select(u => u.Id)
                        .FirstOrDefaultAsync();



                    // Clear session after processing
                    HttpContext.Session.Clear();

                    // Redirect to the HighScores/Index page with the user ID
                    return RedirectToPage("../HighScores/Index", new { userId });
                }
               
                else
                {
                    TempData["Message"] = "An error occurred while accessing the database.";
                    return RedirectToPage("./Quiz");
                }
            }
        }
    }
}
