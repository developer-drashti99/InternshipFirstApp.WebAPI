using System.Security.Claims;

namespace FirstApp.WebAPI.Extensions
{
    // for getting logged in user's id
    public static class ClaimsPrincipalExtensions
    {
        public static string getMemberId(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.NameIdentifier)??
            throw new Exception("Can not get memberId from token");
        }
    }
}