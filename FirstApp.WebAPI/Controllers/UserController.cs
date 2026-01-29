using FirstApp.WebAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FirstApp.WebAPI.Extensions;
namespace FirstApp.WebAPI.Controllers
{
    [Authorize]
    public class UsersController(AppDbContext context) : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<List<UserDto>>> GetUsers()
        {
            try
            {
                List<AppUser> users = await context.Users.ToListAsync();
                return users.Count > 0 ? Ok(users.Select(e => e.ToDto()).ToList()) : BadRequest("No Users Found");
            }
            catch (Exception ex)
            {
                return BadRequest($"{ex.Message}  {ex.Data}");  
            }
        }

        [HttpGet("{Id}")]
        public ActionResult<UserDto> GetUserById(string Id)
        {
            try
            {
                AppUser? user = context.Users.Find(Id);
                return user != null ? Ok(user.ToDto()) : BadRequest($"User Not Found having the Id {Id}");
            }
            catch (Exception ex)
            {
                return BadRequest($"{ex.Message}  {ex.Data}");
            }
        }

        [HttpDelete("{Id}")]
        public ActionResult DeleteUser(string Id)
        {
            try
            {
                AppUser? user = context.Users.Find(Id);
                if (user != null)
                {
                    // context.Users.Remove(user);
                    user.IsActive=false;
                    context.SaveChanges();
                    return Ok($"User Deleted Successfully having the Id  {user.Id}");
                }
                else
                    return BadRequest($"User Not Found having the Id {Id}");
            }
            catch (Exception ex)
            {
                return BadRequest($"{ex.Message}  {ex.Data}");
            }
        }

        [HttpPost]
        public ActionResult AddUser([FromBody]AppUser user)
        {
            try
            {
                context.Users.Add(user);
                context.SaveChanges();
                return Ok($"User Added Successfully having the Id {user.Id}");
            }
            catch (Exception ex)
            {
                return BadRequest($"{ex.Message}  {ex.Data}");
            }
        }
    }
}
