using System;
using System.Collections.Generic;

namespace ProjectEFEntities.OH25EntityModels;

public partial class Visitor
{
    public int VisitorId { get; set; }

    public DateTime Datecreated { get; set; }

    public ulong? LuggageRedeemed { get; set; }

    /// <summary>
    /// ARGB
    /// </summary>
    public string? LuggageTagColorName { get; set; }

    /// <summary>
    /// In the format of &lt;DDD&gt;&lt;visitor_id&gt;&lt;random_3_alphabets&gt;
    /// </summary>
    public string? TicketId { get; set; }

    public virtual LuggageTagColor? LuggageTagColorNameNavigation { get; set; }

    public virtual ICollection<RedemptionQueue> RedemptionQueues { get; set; } = new List<RedemptionQueue>();

    public virtual ICollection<VisitorBooth> VisitorBooths { get; set; } = new List<VisitorBooth>();

    public virtual ICollection<VisitorWorkshop> VisitorWorkshops { get; set; } = new List<VisitorWorkshop>();
}
