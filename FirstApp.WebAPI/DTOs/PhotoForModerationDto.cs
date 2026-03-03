namespace FirstApp.WebAPI.DTOs
{
    public class PhotoForModerationDto
    {
        public int Id { get; set; }
        public string Url { get; set; } = "";
        public bool IsApproved { get; set; }
        public string MemberId { get; set; } = "";
        public string MemberUserName { get; set; } = "";
        public string MemberDisplayName { get; set; } = "";
    }
}
