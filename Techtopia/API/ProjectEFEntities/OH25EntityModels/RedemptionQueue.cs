using System;
using System.Collections.Generic;

namespace ProjectEFEntities.OH25EntityModels;

public partial class RedemptionQueue
{
    public int Queueid { get; set; }

    public int VisitorId { get; set; }

    public string? EngravingText { get; set; }

    public DateTime DateCreated { get; set; }

    public DateTime? DateCompleted { get; set; }

    public virtual Visitor Visitor { get; set; } = null!;
}
