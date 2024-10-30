using System;
using System.Collections.Generic;

namespace ProjectEFEntities.OH25EntityModels;

public partial class Visitor
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

    public virtual ICollection<EngravingQueue> EngravingQueues { get; set; } = new List<EngravingQueue>();

    public virtual LuggageTagColor? LuggageTagColorNameNavigation { get; set; }

    public virtual ICollection<VisitorBooth> VisitorBooths { get; set; } = new List<VisitorBooth>();

    public virtual ICollection<VisitorWorkshop> VisitorWorkshops { get; set; } = new List<VisitorWorkshop>();
}
