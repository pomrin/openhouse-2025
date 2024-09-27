using System;
using System.Collections.Generic;

namespace ProjectEFEntities.OH25EntityModels;

public partial class VisitorWorkshop
{
    public int VisitorId { get; set; }

    public int WorkshopId { get; set; }

    public DateTime? DateCompleted { get; set; }

    public DateTime? DateCertificateSent { get; set; }

    public virtual Visitor Visitor { get; set; } = null!;

    public virtual Workshop Workshop { get; set; } = null!;
}
