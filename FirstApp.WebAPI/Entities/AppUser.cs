using System.ComponentModel.DataAnnotations;
using FirstApp.WebAPI.Entities;

namespace FirstApp.WebAPI
{
    public class AppUser
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public required string DisplayName { get; set; }
        public required string Email { get; set; }
        // for early access
        public string? ImageUrl { get; set; }
        public required byte[] PasswordHash { get; set; }
        public required byte[] PasswordSalt { get; set; }
        public bool IsActive { get; set; } = true;
        public Member? Member { get; set; }

    }
}