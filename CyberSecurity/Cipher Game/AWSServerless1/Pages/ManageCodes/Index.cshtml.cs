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
    public class IndexModel : PageModel
    {
        //private readonly ProjectEFEntities.OpenHouseEfModels.Openhouse24Context _context;

        public IndexModel()
        {
            //_context = context;
        }

        public IList<Code> Code { get; set; } = default!;

        public async Task OnGetAsync()
        {
            using (var _context = new Openhouse24Context())
            {
                if (_context.Codes != null)
                {
                    Code = await _context.Codes.ToListAsync();
                }
            }
        }

    }
}
