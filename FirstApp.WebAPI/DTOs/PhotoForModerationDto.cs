namespace FirstApp.WebAPI.DTOs
{
    public class PhotoForModerationDto
    {
        public int Id { get; set; }

        public required string Url { get; set; }

        public bool IsApproved { get; set; }

        public required string MemberId { get; set; }

        public required string MemberUserName { get; set; }

        public required string MemberDisplayName { get; set; }
    }
}