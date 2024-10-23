using System;
using System.Collections.Generic;

namespace OHEFProject.OH25EntityModels;

public partial class EngravingQueue
{
    public int Queueid { get; set; }

    public int VisitorId { get; set; }

    public string LuggageTagColor { get; set; } = null!;

    public string EngravingText { get; set; } = null!;

    public DateTime DateJoined { get; set; }

    public DateTime? DateEngravingStart { get; set; }

    public DateTime? DatePendingCollection { get; set; }

    public DateTime? DateCollected { get; set; }

    public virtual LuggageTagColor LuggageTagColorNavigation { get; set; } = null!;

    public virtual Visitor Visitor { get; set; } = null!;
}
