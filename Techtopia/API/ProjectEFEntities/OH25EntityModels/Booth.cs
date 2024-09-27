using System;
using System.Collections.Generic;

namespace ProjectEFEntities.OH25EntityModels;

public partial class Booth
{
    public int BoothId { get; set; }

    public string? BoothName { get; set; }

    public string? BoothDescription { get; set; }

    public virtual ICollection<VisitorBooth> VisitorBooths { get; set; } = new List<VisitorBooth>();
}
