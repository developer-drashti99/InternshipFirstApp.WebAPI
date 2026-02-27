namespace FirstApp.WebAPI.DTOs
{
    public class UserWithRolesDto
    {
        public string Id { get; set; } = default!;
        public string UserName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public IList<string> Roles { get; set; } = new List<string>();
    }
}
