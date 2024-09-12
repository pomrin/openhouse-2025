using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using ProjectEFEntities.OpenHouseEfModels;

namespace AWSServerless1.Pages.HighScores
{
    public class DetailsModel : PageModel
    {
        private readonly ProjectEFEntities.OpenHouseEfModels.Openhouse24Context _context;

        public DetailsModel(ProjectEFEntities.OpenHouseEfModels.Openhouse24Context context)
        {
            _context = context;
        }

      public Highscore Highscore { get; set; } = default!; 

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null || _context.Highscores == null)
            {
                return NotFound();
            }

            var highscore = await _context.Highscores.FirstOrDefaultAsync(m => m.Id == id);
            if (highscore == null)
            {
                return NotFound();
            }
            else 
            {
                Highscore = highscore;
            }
            return Page();
        }
    }
}
