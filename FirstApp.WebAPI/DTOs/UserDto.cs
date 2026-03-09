using System.ComponentModel.DataAnnotations;

namespace FirstApp.WebAPI.DTOs
{
    public class UserDto
    {
        public required string Id { get; set; }

        [Required]
        public required string DisplayName { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }
    }
}