using System;
using System.Collections.Generic;

namespace ProjectEFEntities.OpenHouseEfModels;

public partial class Highscore
{
    public int Id { get; set; }

    public string Username { get; set; } = null!;

    /// <summary>
    /// Time taken in seconds
    /// </summary>
    public double Timetaken { get; set; }

    public DateTime Datecreated { get; set; }

    public string? Codes { get; set; }

    public string? Answer { get; set; }

    public virtual Code? CodesNavigation { get; set; }
}
