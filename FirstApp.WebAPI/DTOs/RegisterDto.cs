using System.ComponentModel.DataAnnotations;

namespace FirstApp.WebAPI.DTOs
{
    public class RegisterDto
    {
        [Required]
        [StringLength(100)]
        public required string DisplayName { get; set; } 

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address")]
        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]{2,}$",
    ErrorMessage = "Enter a valid email address.")]
        public required string Email { get; set; } 

        [Required(ErrorMessage = "Password is required")]
        [MinLength(4, ErrorMessage = "Password must be at least 4 characters")]
        public required string Password { get; set; } 

        [Required]
        public required string Gender { get; set; }

        [Required]
        public DateOnly DateOfBirth{ get; set; }
        [Required]
        public required string  City{ get; set; } 
        [Required]
        public required string Country { get; set; }

    }
}
