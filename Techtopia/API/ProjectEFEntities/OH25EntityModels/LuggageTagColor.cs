using System;
using System.Collections.Generic;

namespace ProjectEFEntities.OH25EntityModels;

public partial class LuggageTagColor
{
    public string LuggageTagColorName { get; set; } = null!;

    public string? LuggageTagColorCode { get; set; }

    public virtual ICollection<Visitor> Visitors { get; set; } = new List<Visitor>();
}
