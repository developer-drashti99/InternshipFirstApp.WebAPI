using FirstApp.WebAPI.DTOs;
using FirstApp.WebAPI.Extensions;
using FirstApp.WebAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace FirstApp.WebAPI.Controllers
{
    public class AccountController(AppDbContext context, ITokenService tokenService) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<AuthUserDto>> Register(RegisterDto registerDto)
        {
            if (await EmailExists(registerDto.Email))
                return BadRequest("Email is already registered");
            else
            {   
                using var hmac = new HMACSHA512();
                Employee employee = new Employee
                {
                    DisplayName = registerDto.DisplayName,
                    Email = registerDto.Email,
                    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                    PasswordSalt = hmac.Key,
                    IsActive = true
                };
                context.Employees.Add(employee);
                await context.SaveChangesAsync();
                return employee.ToAuthDto(tokenService);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthUserDto>> Login(LoginDto loginDto)
        {
            Employee employee = await context.Employees.SingleOrDefaultAsync(e => e.Email == loginDto.Email);
            if (employee == null) return Unauthorized("Invalid Email Address");

            using var hmac = new HMACSHA512(employee.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != employee.PasswordHash[i])
                    return Unauthorized("Incorrect Password");
            }

            return employee.ToAuthDto(tokenService);
        }
        private async Task<bool> EmailExists(string email)
        {
            //return await context.Employees.AnyAsync(e=>e.Email.Equals(email,StringComparison.CurrentCultureIgnoreCase));
            return await context.Employees.AnyAsync(e => e.Email.ToLower() == email.ToLower());
        }
    }
}