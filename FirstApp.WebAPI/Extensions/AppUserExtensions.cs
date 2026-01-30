using FirstApp.WebAPI.DTOs;
using FirstApp.WebAPI.Interfaces;

namespace FirstApp.WebAPI.Extensions
{
    public static class AppUserExtensions
    {
        public static UserDto ToDto(this AppUser user)
        {
            return new UserDto
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Email = user.Email,
            };
        }
        public static AuthUserDto ToAuthDto(this AppUser user,ITokenService tokenService)
        {
            return new AuthUserDto
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Email = user.Email,
                ImageUrl=user.ImageUrl,
                Token = tokenService.CreateToken(user)
            };
        }
    }
}
