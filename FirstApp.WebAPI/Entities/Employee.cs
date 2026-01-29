using System.ComponentModel.DataAnnotations;

namespace FirstApp.WebAPI
{
    public class Employee
    {
        [Key]
        public string EmpId { get; set; } = Guid.NewGuid().ToString();
        public required string DisplayName { get; set; }
        public required string Email { get; set; }
        public required byte[] PasswordHash { get; set; }
        public required byte[] PasswordSalt { get; set; }
        public bool IsActive { get; set; } = true;
    }
}