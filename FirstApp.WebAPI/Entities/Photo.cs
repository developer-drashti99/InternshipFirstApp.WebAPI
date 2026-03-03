using System.Text.Json.Serialization;

namespace FirstApp.WebAPI.Entities;

public class Photo
{
    public int Id { get; set; }
    public required string Url { get; set; }
    public bool IsApproved { get; set; } = false;
    public bool IsDeleted { get; set; } = false;
    public string? PublicId { get; set; }

    // Navigational Property
    [JsonIgnore]
    public Member Member { get; set; } = null!;
    public string MemberId { get; set; }=null!;
}
