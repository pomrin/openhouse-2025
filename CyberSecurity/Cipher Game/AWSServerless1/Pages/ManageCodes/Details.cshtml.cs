using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using ProjectEFEntities.OpenHouseEfModels;

namespace AWSServerless1.Pages.ManageCodes
{
    public class DetailsModel : PageModel
    {
        private readonly ProjectEFEntities.OpenHouseEfModels.Openhouse24Context _context;

        public DetailsModel(ProjectEFEntities.OpenHouseEfModels.Openhouse24Context context)
        {
            _context = context;
        }

      public Code Code { get; set; } = default!; 

        public async Task<IActionResult> OnGetAsync(string id)
        {
            if (id == null || _context.Codes == null)
            {
                return NotFound();
            }

            var code = await _context.Codes.FirstOrDefaultAsync(m => m.Codes == id);
            if (code == null)
            {
                return NotFound();
            }
            else 
            {
                Code = code;
            }
            return Page();
        }
    }
}
