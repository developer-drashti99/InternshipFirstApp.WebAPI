using System.ComponentModel.DataAnnotations;

namespace FirstApp.WebAPI.DTOs
{
    public class ForgotPasswordDto
    {
        [EmailAddress]
        public required string Email { get; set; }
    }
}