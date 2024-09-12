using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using ProjectEFEntities.OpenHouseEfModels;

namespace AWSServerless1.Pages.ManageCodes
{
    public class CreateModel : PageModel
    {
        //private readonly ProjectEFEntities.OpenHouseEfModels.Openhouse24Context _context;

        public CreateModel(ProjectEFEntities.OpenHouseEfModels.Openhouse24Context context)
        {
            //_context = context;
        }

        public IActionResult OnGet()
        {
            return Page();
        }

        [BindProperty]
        public Code Code { get; set; } = default!;


        // To protect from overposting attacks, see https://aka.ms/RazorPagesCRUD
        public async Task<IActionResult> OnPostAsync()
        {
            using (var _context = new Openhouse24Context())
            {
                if (!ModelState.IsValid || _context.Codes == null || Code == null)
                {
                    return Page();
                }

                _context.Codes.Add(Code);
                await _context.SaveChangesAsync();

                return RedirectToPage("./Index");
            }
        }
    }
}
