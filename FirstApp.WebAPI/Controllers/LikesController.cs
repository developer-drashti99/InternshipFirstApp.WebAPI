using FirstApp.WebAPI.Entities;
using FirstApp.WebAPI.Extensions;
using FirstApp.WebAPI.Helpers;
using FirstApp.WebAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FirstApp.WebAPI.Controllers
{
    //[Authorize(Roles="Member")]
    public class LikesController(ILikesRepository likesRepository) : BaseApiController
    {
        [HttpPost("{targetMemberId}")]
        public async Task<ActionResult> ToggleLike(string targetMemberId)
        {
            if (User.IsInRole("Admin"))
                return BadRequest("Admins cannot like members.");
            var sourceMemberId = User.getMemberId();
            if (sourceMemberId == targetMemberId) return BadRequest("You cannot like yourself");

            var existingLike = await likesRepository.GetMemberLike(sourceMemberId, targetMemberId);

            if (existingLike == null)
            {
                var like = new MemberLike
                {
                    SourceMemberId = sourceMemberId,
                    TargetMemberId = targetMemberId
                };
                likesRepository.AddLike(like);
            }
            else
            {
                likesRepository.DeleteLike(existingLike);
            }
            if (await likesRepository.SaveAllChanges()) return Ok();

            return BadRequest("Failed to update like");
        }

        [HttpGet("list")]
        public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikeIds()
        {
            return Ok(await likesRepository.GetCurrentMemberLikeIds(User.getMemberId()));
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<Member>>> GetMemberLikes([FromQuery] LikesParams likesParams)
        {
            likesParams.MemberId = User.getMemberId();
            var members = await likesRepository.GetMemberLikes(likesParams);
            return Ok(members);
        }
    }
}
