using System;
using System.Collections.Generic;

namespace OHEFProject.OH25EntityModels;

public partial class VisitorBooth
{
    public int VisitorId { get; set; }

    public int BoothId { get; set; }

    public DateTime? DateVisited { get; set; }

    public virtual Booth Booth { get; set; } = null!;

    public virtual Visitor Visitor { get; set; } = null!;
}
