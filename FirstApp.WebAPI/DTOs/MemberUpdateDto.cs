using System.ComponentModel.DataAnnotations;

namespace FirstApp.WebAPI.DTOs
{
    public class MemberUpdateDto
    {
        [StringLength(100)]
        public string? DisplayName { get; set; }

        [StringLength(1000)]
        public string? Description { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(100)]
        public string? Country { get; set; }
    }
}