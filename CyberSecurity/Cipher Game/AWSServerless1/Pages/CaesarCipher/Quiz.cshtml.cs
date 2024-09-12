using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components.Server.ProtectedBrowserStorage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.EntityFrameworkCore;
using ProjectEFEntities.OpenHouseEfModels;
using static System.Collections.Specialized.BitVector32;

namespace AWSServerless1.Pages.CaesarCipher
{
    public class QuizModel : PageModel
    {
        private readonly Game _game;
        public Code Item { get; set; }
      
        public string EncryptedMessage { get; set; }
        public string DecryptedMessage { get; set; }
        public IList<Code> Code { get; set; } = default!;

        [BindProperty]
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "Only alphabets and spaces are allowed.")]
        public string UserInput { get; set; }

        public QuizModel(Game game)
        {
            _game = game;
        }

        public async Task OnGetAsync()
        {
            
            if (HttpContext.Session.GetString("EncryptedMessage") == null)
            {
                using (var _context = new Openhouse24Context())
                {

                    if (_context.Codes != null)
                    {
                        Code = await _context.Codes.ToListAsync();
                    }

                    var random = new Random();
                    Item = Code[random.Next(Code.Count)];

                    _game.StartNewRound(Item.Codes, HttpContext.Session);
                    EncryptedMessage = _game.EncryptedMessage;
                    DecryptedMessage = _game.DecryptedMessage;
                }
            }
            else
            {
                EncryptedMessage = HttpContext.Session.GetString("EncryptedMessage");
                DecryptedMessage = HttpContext.Session.GetString("DecryptedMessage");
            }
        }

        public async Task<IActionResult> OnPostAsync(double timeTaken)
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
                return RedirectToPage("./Quiz");
            }

            UserInput = UserInput?.Trim();

            var isCorrect = _game.CheckAnswer(UserInput, HttpContext.Session);

            if (isCorrect)
            {
                HttpContext.Session.Clear();
                return RedirectToPage("./Username", new { answer = UserInput, timetaken = timeTaken, decryptedMessage = _game.DecryptedMessage });
            }
            else
            {
                TempData["Message"] = "Your answer is incorrect!";
            }

            return RedirectToPage("./Quiz");
        }
    }

    public class Game
    {
        private readonly CaesarCipher _cipher = new CaesarCipher();
        private string _sessionKey = "GameKey";
        private const string EncryptedMessageKey = "EncryptedMessage";
        private const string DecryptedMessageKey = "DecryptedMessage";

        public string EncryptedMessage { get; private set; }
        public string DecryptedMessage { get; private set; }
        public void StartNewGame(string message, ISession session)
        {
            StartNewRound(message, session);
        }
        public void StartNewRound(string message, ISession session)
        {
            var random = new Random();
            //This is the caesar cipher shift list
            int[] cipher_shift = { 3, 11, 16};
            
            /*var key = random.Next(1, 26);*/
            //This is to pick a index of the number in the list of number for the caesar cipher shift
            var Generate = random.Next(cipher_shift.Count());

            //This is to select the random number chosen based on index
            var key = cipher_shift[Generate];

            session.SetInt32(_sessionKey,key);
          
            EncryptedMessage = _cipher.Encrypt(key, message);
            DecryptedMessage = _cipher.Decrypt(key, EncryptedMessage);

            // Store the generated values in the session
            session.SetString(EncryptedMessageKey, EncryptedMessage);
            session.SetString(DecryptedMessageKey, DecryptedMessage);
            
        }

        public bool CheckAnswer(string userAnswer, ISession session)
        {
            var key = session.GetInt32(_sessionKey);
            if (key.HasValue)
              
            {
                var encryptedUserAnswer = _cipher.Encrypt(key.Value, userAnswer.ToUpper());
                Debug.WriteLine("USER ANSWER: " + userAnswer);
                Debug.WriteLine("ENCRYPTED USER ANSWER: " + encryptedUserAnswer);
                Debug.WriteLine("KEY: " + key);

                // Retrieve the stored EncryptedMessage and DecryptedMessage from the session
                EncryptedMessage = session.GetString(EncryptedMessageKey);
                DecryptedMessage = session.GetString(DecryptedMessageKey);
                Debug.WriteLine("EncryptedMessage (ANS): " + EncryptedMessage);
                Debug.WriteLine("DecryptedMessage (ANS): " + DecryptedMessage);
                
                return encryptedUserAnswer == EncryptedMessage;
                
            }

            return false; // No key found
        }
    }

    public class CaesarCipher
    {
        private const string Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        public string Encrypt(int key, string input)
        {
            input = input.ToUpper();
            var output = string.Empty;

            foreach (var ch in input)
            {
                if (!char.IsLetter(ch))
                {
                    output += ch;
                    continue;
                }

                var index = Alphabet.IndexOf(ch);
                index = (index + key) % Alphabet.Length;

                if (index < 0)
                {
                    index += Alphabet.Length;
                }

                output += Alphabet[index];
            }

            return output;
        }

        public string Decrypt(int key, string input)
        {
            return Encrypt(-key, input);
        }
    }
}
