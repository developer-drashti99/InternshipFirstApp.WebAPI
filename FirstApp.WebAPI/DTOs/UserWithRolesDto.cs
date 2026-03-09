using System.ComponentModel.DataAnnotations;

namespace FirstApp.WebAPI.DTOs
{
    public class UserWithRolesDto
    {
        public required string Id { get; set; }

        [Required]
        public required string UserName { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        public IList<string> Roles { get; set; } = new List<string>();
    }
}