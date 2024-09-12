using System;
using System.Collections.Generic;

namespace ProjectEFEntities.OpenHouseEfModels;

public partial class Code
{
    public string Codes { get; set; } = null!;

    public DateTime? Datecreated { get; set; }

    public string? Updated { get; set; }

    public virtual ICollection<Highscore> Highscores { get; set; } = new List<Highscore>();
}
