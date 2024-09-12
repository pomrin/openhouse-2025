using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using ProjectEFEntities.OpenHouseEfModels;

namespace AWSServerless1.Pages.HighScores
{
    public class IndexModel : PageModel
    {
        public int UserId { get; set; }
        public string DateCreated { get; set; }

        public string Username { get; set; }

        public double TimeTaken { get; set; }
        public IList<Highscore> Highscore { get; set; } = default!;

        public async Task OnGetAsync(int userId)
        {
            UserId = userId;
            using (var _context = new Openhouse24Context())
            {
                // Retrieve all players from the database
                Highscore = await _context.Highscores
                    .Include(h => h.CodesNavigation)
                    .OrderBy(h => h.Timetaken)
                    .ToListAsync();

                // Convert the IList<Highscore> to List<Highscore>
                var highscoreList = Highscore.ToList();

                // Check if the current user is in the list
                
                var user = highscoreList.FirstOrDefault(h => h.Id == UserId);
                var userRank = highscoreList.FindIndex(h => h.Id == UserId) + 1;
               
             
                if (userRank == 0)
                {
                    ViewData["RankMessage"] = $"You are not ranked among the top {_context.Highscores.Count()} users.";
                }
                else
                {
                    ViewData["RankMessage"] = $"Kudos! You are in the {userRank}{GetRankSuffix(userRank)} position on the ranking.";

                    if (userRank <= 5)
                    {
                        ViewData["RankMessage"] = $"Congrats! You are among the top 5 players at {userRank}{GetRankSuffix(userRank)} place.";
                    }
                }

                ViewData["UserRank"] = userRank;
                if (user != null)
                {
                    Username = user.Username;
                    TimeTaken = user.Timetaken;
                }

                // Display only the top 5 players
                Highscore = highscoreList.Take(5).ToList();
            }
        }

        private string GetRankSuffix(int rank)
        {
            if (rank >= 11 && rank <= 13)
            {
                return "th";
            }

            switch (rank % 10)
            {
                case 1:
                    return "st";
                case 2:
                    return "nd";
                case 3:
                    return "rd";
                default:
                    return "th";
            }
        }
    }
}
