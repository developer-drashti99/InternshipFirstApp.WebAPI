using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using FirstApp.WebAPI.DTOs;
using FirstApp.WebAPI.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FirstApp.WebAPI.Data;

public class Seed
{
    public static async Task SeedUsers(UserManager<AppUser> userManager)
    {
        if (await userManager.Users.AnyAsync()) return;
        var memberData = await File.ReadAllTextAsync("Data/UserSeedData.json");
        var members = JsonSerializer.Deserialize<List<SeedUserDto>>(memberData);

        if (members == null)
        {
            Console.WriteLine(" No Members in seed data");
            return;
        }
        foreach (var member in members)
        {
            var user = new AppUser
            {
                Id = member.Id,
                UserName = member.Email,
                DisplayName = member.DisplayName,
                Email = member.Email,
                ImageUrl = member.ImageUrl,
                Member = new Member
                {
                    Id = member.Id,
                    DisplayName = member.DisplayName,
                    Description = member.Description,
                    DateOfBirth = member.DateOfBirth,
                    ImageUrl = member.ImageUrl,
                    City = member.City,
                    Gender = member.Gender,
                    Country = member.Country
                }
            };
            user.Member.Photos.Add(new Photo
            {
                Url = member.ImageUrl!,
                MemberId = member.Id
            }
            );
            var result = await userManager.CreateAsync(user, "Pa$$w0rd");
            if (!result.Succeeded)
            {
                Console.WriteLine(result.Errors.First().Description);
            }
            await userManager.AddToRoleAsync(user, "Member");
        }
        var admin = new AppUser
        {
            UserName = "admin",
            DisplayName = "Admin",
            Email = "admin@test.com"
        };
        await userManager.CreateAsync(admin, "Pa$$w0rd");
        await userManager.AddToRolesAsync(admin, ["Admin", "Moderator"]);
    }
}
