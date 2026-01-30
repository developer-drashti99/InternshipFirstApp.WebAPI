namespace FirstApp.WebAPI.DTOs
{
    public class AuthUserDto
    {
        public string Id { get; set; }
        public required string DisplayName { get; set; }
        public required string Email { get; set; }
        // public string? ImageUrl { get; set; }
        public string Token { get; set; }
    }

}