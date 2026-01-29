using System.ComponentModel.DataAnnotations;

namespace FirstApp.WebAPI.DTOs
{
    public class EmployeeDto
    {
        public required string EmpId { get; set; }
        public required string DisplayName { get; set; }
        public required string Email { get; set; }
        public string? ImageUrl { get; set; }
    }
}
