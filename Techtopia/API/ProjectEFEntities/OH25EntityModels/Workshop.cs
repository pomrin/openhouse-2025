using System;
using System.Collections.Generic;

namespace ProjectEFEntities.OH25EntityModels;

public partial class Workshop
{
    public int WorkshopId { get; set; }

    public string? WorkshopDescription { get; set; }

    public virtual ICollection<VisitorWorkshop> VisitorWorkshops { get; set; } = new List<VisitorWorkshop>();
}
