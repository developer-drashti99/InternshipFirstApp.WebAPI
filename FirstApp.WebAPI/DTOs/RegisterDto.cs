using System.ComponentModel.DataAnnotations;

namespace FirstApp.WebAPI.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string DisplayName { get; set; } = "";

        [Required]
        [EmailAddress]
        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]{2,}$",
    ErrorMessage = "Enter a valid email address.")]
        public string Email { get; set; } = "";
        
        [Required]
        [MinLength(4)]
        public string Password { get; set; } = "";

        [Required]
        public string Gender { get; set; } = string.Empty;

        [Required]
        public DateOnly DateOfBirth{ get; set; }
        [Required]
        public string  City{ get; set; } = string.Empty;
        [Required]
        public string Country { get; set; } = string.Empty;

    }
}
