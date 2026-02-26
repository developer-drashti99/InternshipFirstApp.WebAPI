using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using FirstApp.WebAPI.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace FirstApp.WebAPI.Services
{
    public class TokenService(IConfiguration config, UserManager<AppUser> userManager) : ITokenService
    {
        public async Task<string> CreateToken(AppUser user)
        {
            //?? is null collision operator
            var tokenKey = config["TokenKey"] ?? throw new Exception("Can not get Token Key");

            if (tokenKey.Length < 64)
                throw new Exception("Token Key length is less than 64 characters");

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(tokenKey));

            var claims = new List<Claim>
            {
                new(ClaimTypes.Email,user.Email!),
                new(ClaimTypes.NameIdentifier,user.Id),
            };


            //Get the roles of the user and add them as claims
            var roles = await userManager.GetRolesAsync(user);

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddMinutes(7),
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            var randomBytes = RandomNumberGenerator.GetBytes(64);
            return Convert.ToBase64String(randomBytes);
        }
    }
}
