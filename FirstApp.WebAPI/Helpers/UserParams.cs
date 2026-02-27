namespace FirstApp.WebAPI.Helpers
{
    public class UserParams : PagingParams
    {
        public string? Role { get; set; }
        public string? Search { get; set; }
        public string OrderBy { get; set; } = "username";
    }
}