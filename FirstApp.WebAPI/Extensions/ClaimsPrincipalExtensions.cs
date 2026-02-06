using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

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