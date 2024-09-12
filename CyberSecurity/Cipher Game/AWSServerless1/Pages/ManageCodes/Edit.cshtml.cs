using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ProjectEFEntities.OpenHouseEfModels;

namespace AWSServerless1.Pages.ManageCodes
{
    public class EditModel : PageModel
    {
        private readonly ProjectEFEntities.OpenHouseEfModels.Openhouse24Context _context;

        public EditModel(ProjectEFEntities.OpenHouseEfModels.Openhouse24Context context)
        {
            _context = context;
        }

        [BindProperty]
        public Code Code { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(string id)
        {
            if (id == null || _context.Codes == null)
            {
                return NotFound();
            }

            var code =  await _context.Codes.FirstOrDefaultAsync(m => m.Codes == id);
            if (code == null)
            {
                return NotFound();
            }
            Code = code;
            return Page();
        }

        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see https://aka.ms/RazorPagesCRUD.
        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.Attach(Code).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CodeExists(Code.Codes))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return RedirectToPage("./Index");
        }

        private bool CodeExists(string id)
        {
          return (_context.Codes?.Any(e => e.Codes == id)).GetValueOrDefault();
        }
    }
}
