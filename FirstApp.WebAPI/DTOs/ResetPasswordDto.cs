using System.ComponentModel.DataAnnotations;

namespace FirstApp.WebAPI.DTOs
{
    public class ResetPasswordDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "New password is required")]
        [MinLength(4, ErrorMessage = "Password must be at least 4 characters")]
        public required string NewPassword { get; set; }
    }
}