using FirstApp.WebAPI.DTOs;
using FirstApp.WebAPI.Entities;
using FirstApp.WebAPI.Extensions;
using FirstApp.WebAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FirstApp.WebAPI.Controllers
{
    public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<AuthUserDto>> Register(RegisterDto registerDto)
        {
            AppUser user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email,
                IsActive = true,
                Member = new Member
                {
                    DisplayName = registerDto.DisplayName,
                    City = registerDto.City,
                    Country = registerDto.Country,
                    Gender = registerDto.Gender,
                    DateOfBirth = registerDto.DateOfBirth
                }
            };
            var result = await userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code + " identity", error.Description);
                }
                return ValidationProblem(ModelState);
            }
            //setting default user as member
            var role = await userManager.AddToRoleAsync(user, "Member");

            await SetRefreshTokenCookie(user);

            return await user.ToAuthDto(tokenService);

        }

        //[HttpPost("login")]
        //public async Task<ActionResult<AuthUserDto>> Login(LoginDto loginDto)
        //{
        //    AppUser? user = await userManager.FindByEmailAsync(loginDto.Email);
        //    if (user == null) return Unauthorized("Invalid Email Address");

        //    var result = await userManager.CheckPasswordAsync(user, loginDto.Password);

        //    if(!result) return Unauthorized("Invalid Password");) 

        //    return user.ToAuthDto(tokenService);
        //}
        [HttpPost("login")]
        public async Task<ActionResult<AuthUserDto>> Login(LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid login request");

            var user = await userManager.FindByEmailAsync(loginDto.Email);

            // Always return same message
            if (user == null)
                return Unauthorized("Invalid credentials");

            var result = await userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!result)
                return Unauthorized("Invalid credentials");

            // Optional: check if account is locked
            if (await userManager.IsLockedOutAsync(user))
                return Unauthorized("Account is locked. Please try later.");

            await SetRefreshTokenCookie(user);

            return await user.ToAuthDto(tokenService);
        }


        //generating new access token using refresh token
        [HttpPost("refresh-token")]
        public async Task<ActionResult<AuthUserDto>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (refreshToken == null) return NoContent();

            var user = await userManager.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken && u.RefreshTokenExpiry > DateTime.UtcNow);

            if (user == null) return Unauthorized();

            await SetRefreshTokenCookie(user);

            return await user.ToAuthDto(tokenService);
        }

        private async Task SetRefreshTokenCookie(AppUser user)
        {
            var refreshToken = tokenService.GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,//https
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            await userManager.Users.
                  Where(u => u.Id == User.getMemberId())
                  .ExecuteUpdateAsync(setters => setters.SetProperty(
                      u => u.RefreshToken, _ => null)
                  .SetProperty(x => x.RefreshTokenExpiry, _ => null)
                  );
            Response.Cookies.Delete("refreshToken");

            return Ok();
        }
    }
}