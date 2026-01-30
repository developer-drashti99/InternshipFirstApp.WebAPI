using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FirstApp.WebAPI.Interfaces;
using FirstApp.WebAPI.Entities;
namespace FirstApp.WebAPI.Controllers
{
    [Authorize]
    public class UsersController(IMemberRepository memberRepository) : BaseApiController
    {
        // [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetUsers()
        {
            try
            {
                return Ok(await memberRepository.GetMembersAsync());
            }
            catch (Exception ex)
            {
                return BadRequest($"{ex.Message}  {ex.Data}");
            }
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<Member>> GetUserById(string Id)
        {
            try
            {
                var member = await memberRepository.GetMemberByIdAsync(Id);
                if (member == null) return NotFound();
                return member;
            }
            catch (Exception ex)
            {
                return BadRequest($"{ex.Message}  {ex.Data}");
            }
        }

        // [HttpDelete("{Id}")]
        // public ActionResult DeleteUser(string Id)
        // {
        //     try
        //     {
        //         AppUser? user = context.Users.Find(Id);
        //         if (user != null)
        //         {
        //             user.IsActive=false;
        //             context.SaveChanges();
        //             return Ok($"User Deleted Successfully having the Id  {user.Id}");
        //         }
        //         else
        //             return BadRequest($"User Not Found having the Id {Id}");
        //     }
        //     catch (Exception ex)
        //     {
        //         return BadRequest($"{ex.Message}  {ex.Data}");
        //     }
        // }

        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
        {
            return Ok(await memberRepository.GetPhotosForMemberAsync(id));
        }

        [HttpPost]
        public ActionResult AddUser([FromBody] AppUser user)
        {
            try
            {
                // context.Users.Add(user);
                memberRepository.SaveAllAsync();
                return Ok($"User Added Successfully having the Id {user.Id}");
            }
            catch (Exception ex)
            {
                return BadRequest($"{ex.Message}  {ex.Data}");
            }
        }
    }
}
