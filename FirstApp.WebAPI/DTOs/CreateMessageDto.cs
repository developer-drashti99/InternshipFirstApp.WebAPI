using System.ComponentModel.DataAnnotations;
namespace FirstApp.WebAPI.DTOs
{
    public class CreateMessageDto
    {
        [Required]
        public required string RecipientId { get; set; }
        
        [Required]
        [StringLength(1000, MinimumLength = 1)]
        public required string Content { get; set; }
    }
}