using System.Collections.Concurrent;
using FirstApp.WebAPI.DTOs;
using FirstApp.WebAPI.Entities;
using FirstApp.WebAPI.Extensions;
using FirstApp.WebAPI.Interfaces;
using FirstApp.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FirstApp.WebAPI.Controllers
{
    public class AccountController(UserManager<AppUser> userManager,
    ITokenService tokenService, ILogger<AccountController> logger,
    EmailService emailService) : BaseApiController
    {
        private static ConcurrentDictionary<string, string> OtpData = new();
        private readonly ILogger<AccountController> _logger = logger;

        [HttpPost("register")]
        public async Task<ActionResult<AuthUserDto>> Register(RegisterDto registerDto)
        {
            AppUser user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email.Trim().ToLower(),
                UserName = registerDto.Email.Trim().ToLower(),
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
            var roleResult = await userManager.AddToRoleAsync(user, "Member");

            if (!roleResult.Succeeded)
            {
                return BadRequest("Failed to assign role to the user.");
            }

            await SetRefreshTokenCookie(user);

            return Ok(await user.ToAuthDto(tokenService));
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthUserDto>> Login(LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid login request.");

            var user = await userManager.FindByEmailAsync(loginDto.Email.Trim().ToLower());

            if (user == null)
            {
                _logger.LogWarning("Failed login attempt for {Email}", loginDto.Email.Trim().ToLower());
                return Unauthorized("Invalid email or password.");
            }

            // Optional: check if account is locked
            if (await userManager.IsLockedOutAsync(user))
                return Unauthorized("Your account is locked. Please try again later.");

            var result = await userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!result)
            {
                _logger.LogWarning("Failed login attempt for {Email}", loginDto.Email.Trim().ToLower());
                return Unauthorized("Invalid email or password.");
            }

            await SetRefreshTokenCookie(user);

            _logger.LogInformation("User {Email} logged in successfully", user.Email);

            return Ok(await user.ToAuthDto(tokenService));
        }

        //generating new access token using refresh token
        [HttpPost("refresh-token")]
        public async Task<ActionResult<AuthUserDto>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (refreshToken == null)
                return Unauthorized("Refresh token not found.");

            var user = await userManager.Users.FirstOrDefaultAsync(
                u => u.RefreshToken == refreshToken && u.RefreshTokenExpiry > DateTime.UtcNow);

            if (user == null)
                return Unauthorized("Invalid or expired refresh token.");

            await SetRefreshTokenCookie(user);

            return Ok(await user.ToAuthDto(tokenService));
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

        [HttpPost("change-pwd")]
        public async Task<ActionResult> ChangePassword(ChangePasswordDto changePassword)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid password change request.");
            }

            var userId = User.getMemberId();

            if (userId == null)
                return Unauthorized("User authentication required.");

            var user = await userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound("User account not found.");

            var isOldPasswordCorrect = await userManager.CheckPasswordAsync(user, changePassword.OldPassword);

            if (!isOldPasswordCorrect)
                return BadRequest("The current password is incorrect.");

            var result = await userManager.ChangePasswordAsync(
                user,
                changePassword.OldPassword,
                changePassword.NewPassword
            );

            if (!result.Succeeded)
                return BadRequest("Failed to change the password.");

            return Ok("Password changed successfully.");
        }

        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
        {
            var email = dto.Email.Trim().ToLower();
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
                return BadRequest("Unable to process password reset request.");

            var otp = Random.Shared.Next(100000, 999999).ToString();
            OtpData[email] = otp;

            var body = $@"
<div style='font-family:Arial,sans-serif;text-align:center'>
  <h2>Password Reset OTP</h2>
  <p>Use the OTP below to reset your password.</p>

  <div style='
      font-size:32px;
      font-weight:bold;
      letter-spacing:8px;
      background:#6366f1;
      color:white;
      padding:15px;
      border-radius:8px;
      display:inline-block;
      margin:20px 0;
  '>
  {otp}
  </div>

  <p style='color:gray;font-size:12px'>
  If you did not request this, please ignore this email.
  </p>
</div>";

            try
            {
                await emailService.SendEmailAsync(email, "Reset Password", body);
            }
            catch
            {
                return StatusCode(500, "Failed to send password reset email.");
            }

            return Ok("Password reset OTP sent to your email.");
        }

        [AllowAnonymous]
        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp(VerifyOtpDto dto)
        {
            var email = dto.Email.Trim().ToLower();

            if (!OtpData.TryGetValue(email, out var storedOtp))
                return BadRequest("OTP not found or expired.");

            if (storedOtp != dto.Otp)
                return BadRequest("Invalid OTP.");

            OtpData.TryRemove(email, out _);

            return Ok("OTP verified successfully.");
        }

        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
        {
            var email = dto.Email.Trim().ToLower();
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
                return BadRequest("User account not found.");

            var token = await userManager.GeneratePasswordResetTokenAsync(user);

            var result = await userManager.ResetPasswordAsync(user, token, dto.NewPassword);

            if (!result.Succeeded)
                return BadRequest("Password reset failed.");

            return Ok("Password reset successfully.");
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

            _logger.LogInformation("User {UserId} logged out", User.getMemberId());

            return Ok("User logged out successfully.");
        }
    }
}