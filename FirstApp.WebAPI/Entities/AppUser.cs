using System.ComponentModel.DataAnnotations;
using FirstApp.WebAPI.Entities;
using Microsoft.AspNetCore.Identity;

namespace FirstApp.WebAPI
{
    public class AppUser :IdentityUser
    {
        public required string DisplayName { get; set; }
        // for early access
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; } = true;
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }
        public Member? Member { get; set; }

    }
}