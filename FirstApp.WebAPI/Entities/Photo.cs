using System;

namespace FirstApp.WebAPI.Entities;

public class Photo
{
    public int Id { get; set; }
    public required string Url { get; set; }
    public string? PublicId { get; set; }

    // Navigational Property
    public Member member { get; set; } = null;
}
