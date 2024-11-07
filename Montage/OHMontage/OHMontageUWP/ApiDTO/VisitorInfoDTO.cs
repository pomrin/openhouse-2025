using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OHMontageUWP.ApiDTO
{
    internal class VisitorInfoDTO
    {
        public int VisitorId { get; set; }

        public DateTime Datecreated { get; set; }

        /// <summary>
        /// ARGB
        /// </summary>
        public string? LuggageTagColorName { get; set; }

        /// <summary>
        /// In the format of &lt;DDD&gt;&lt;visitor_id&gt;&lt;random_3_alphabets&gt;
        /// </summary>
        public string? TicketId { get; set; }

        public DateTime? LuggageRedeemedDate { get; set; }

        public string? ProfileImageUrl { get; set; }

        public DateTime? DateCertificateSent { get; set; }

    }
}
