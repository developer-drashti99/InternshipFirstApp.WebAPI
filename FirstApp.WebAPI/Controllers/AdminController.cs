using FirstApp.WebAPI.DTOs;
using FirstApp.WebAPI.Entities.enums;
using FirstApp.WebAPI.Helpers;
using FirstApp.WebAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FirstApp.WebAPI.Controllers
{
    public class AdminController(UserManager<AppUser> userManager, IUnitOfWork uow) : BaseApiController
    {
        #region comment 
        //[Authorize(Policy = "RequireAdminRole")]
        //[HttpGet("users-with-roles")]
        //public async Task<ActionResult> GetUsersWithRoles()
        //{
        //    var users = await userManager.Users.ToListAsync();
        //    var userList = new List<object>();

        //    foreach (var user in users)
        //    {
        //        var roles = await userManager.GetRolesAsync(user);
        //        userList.Add(new
        //        {
        //            user.Id,
        //            user.UserName,
        //            user.Email,
        //            roles
        //        });

        //    }

        //    return Ok(userList);
        //}
        #endregion comment

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult<PaginatedResult<UserWithRolesDto>>> GetUsersWithRoles(
     [FromQuery] UserParams userParams)
        {
            return Ok(await uow.memberRepository.GetUsersWithRolesAsync(userParams));
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("edit-roles/{userId}")]
        public async Task<ActionResult> EditRoles(string userId, [FromQuery] string roles)
        {
            if (string.IsNullOrEmpty(roles)) return BadRequest("You must select at least one role.");

            var selectedRoles = roles.Split(",").ToArray();

            var user = await userManager.FindByIdAsync(userId);

            if (user == null) return BadRequest("Could not retrieve user");

            var userRoles = await userManager.GetRolesAsync(user);

            var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded) return BadRequest("Failed to add to roles");

            result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded) return BadRequest("Failed to remove from roles");

            return Ok(await userManager.GetRolesAsync(user));
        }


        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public async Task<ActionResult<PaginatedResult<PhotoForModerationDto>>>
    GetPhotosForModeration([FromQuery] int pageNumber = 1,
                           [FromQuery] int pageSize = 10)
        {
            var result = await uow.memberRepository
                .GetUnapprovedPhotosAsync(pageNumber, pageSize);

            return Ok(result);
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("photos-to-moderate/{photoId}")]
        public async Task<ActionResult> ApproveOrRejectPhoto(int photoId, [FromQuery] PhotoModerationAction action)
        {
            await uow.memberRepository.ModeratePhoto(photoId,action);
            return Ok();
        }
    }
}
