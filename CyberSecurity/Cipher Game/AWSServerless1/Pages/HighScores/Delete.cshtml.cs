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
    public class DeleteModel : PageModel
    {
        //private readonly ProjectEFEntities.OpenHouseEfModels.Openhouse24Context _context;

        public DeleteModel()
        {
            //_context = context;
        }

        [BindProperty]
        public Highscore Highscore { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            using (var _context = new Openhouse24Context())
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
            }
            return Page();
        }

        public async Task<IActionResult> OnPostAsync(int? id)
        {
            using (var _context = new Openhouse24Context())
            {
                if (id == null || _context.Highscores == null)
                {
                    return NotFound();
                }
                var highscore = await _context.Highscores.FindAsync(id);

                if (highscore != null)
                {
                    Highscore = highscore;
                    _context.Highscores.Remove(Highscore);
                    await _context.SaveChangesAsync();
                }
            }
            return RedirectToPage("./Index");
        }
    }
}
