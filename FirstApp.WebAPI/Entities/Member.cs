using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FirstApp.WebAPI.Entities;

public class Member
{
    public string Id { get; set; } = null!;
    public required string DisplayName { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    public required string Gender { get; set; }
    public string? Description { get; set; }
    public required string City { get; set; }
    public required string Country { get; set; }

    // Navigational Property
    [JsonIgnore]
    public List<Photo> Photos { get; set; } = [];

    // specify foreign key
    [JsonIgnore]
    [ForeignKey(nameof(Id))]
    public AppUser User { get; set; } = null!;


}
