using System.ComponentModel.DataAnnotations;

namespace FirstApp.WebAPI.DTOs
{
    public class UserDto
    {
        public required string Id { get; set; }
        public required string DisplayName { get; set; }
        public required string Email { get; set; }
    }
}
