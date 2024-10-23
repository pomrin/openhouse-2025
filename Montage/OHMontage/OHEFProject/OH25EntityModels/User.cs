using System;
using System.Collections.Generic;

namespace OHEFProject.OH25EntityModels;

/// <summary>
/// Accounts for Booth Admins
/// </summary>
public partial class User
{
    public string UserName { get; set; } = null!;

    public string? Password { get; set; }
}
