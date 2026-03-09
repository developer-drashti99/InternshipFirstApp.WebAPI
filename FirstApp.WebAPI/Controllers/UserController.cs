using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FirstApp.WebAPI.Interfaces;
using FirstApp.WebAPI.Entities;
using FirstApp.WebAPI.DTOs;
using FirstApp.WebAPI.Extensions;
using FirstApp.WebAPI.Helpers;

namespace FirstApp.WebAPI.Controllers
{
    [Authorize]
    public class UsersController(IUnitOfWork uow, IPhotoService photoService) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetUsers([FromQuery] MemberParams memberParams)
        {
            memberParams.CurrentMemberId = User.getMemberId();

            return Ok(await uow.memberRepository.GetMembersAsync(memberParams));
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<Member>> GetUserById(string Id)
        {
            var member = await uow.memberRepository.GetMemberByIdAsync(Id);

            if (member == null)
                return NotFound("Member not found.");

            return Ok(member);
        }

        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
        {
            return Ok(await uow.memberRepository.GetPhotosForMemberAsync(id, User.getMemberId() == id));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            var memberId = User.getMemberId();

            var member = await uow.memberRepository.GetMemberForUpdate(memberId);

            if (member == null)
                return BadRequest("Unable to retrieve member profile.");

            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;

            // update displayname in user also
            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;

            uow.memberRepository.Update(member); //optional

            if (await uow.Complete())
                return Ok("Member profile updated successfully.");

            return BadRequest("Failed to update member profile.");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)//name should be file 
        {
            var member = await uow.memberRepository.GetMemberForUpdate(User.getMemberId());

            if (member == null)
                return BadRequest("Unable to load member profile.");

            var result = await photoService.UploadPhotoAsync(file);

            if (result.Error != null)
                return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = User.getMemberId(),
            };

            member.Photos.Add(photo);

            if (await uow.Complete())
                return Ok(photo);

            return BadRequest("Failed to upload photo.");
        }

        //setting up the image as a profile photo
        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var member = await uow.memberRepository.GetMemberForUpdate(User.getMemberId());

            if (member == null)
                return BadRequest("Unable to load member profile.");

            var photo = member.Photos.FirstOrDefault(m => m.Id == photoId);

            if (photo == null || member.ImageUrl == photo.Url)
                return BadRequest("Invalid photo selection.");

            member.ImageUrl = photo?.Url;
            member.User.ImageUrl = photo?.Url;

            if (await uow.Complete())
                return Ok("Profile photo updated successfully.");

            return BadRequest("Failed to update profile photo.");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var member = await uow.memberRepository.GetMemberForUpdate(User.getMemberId());

            if (member == null)
                return BadRequest("Unable to load member profile.");

            var photo = member.Photos.FirstOrDefault(m => m.Id == photoId);

            if (photo == null || photo.Url == member.ImageUrl)
                return BadRequest("This photo cannot be deleted.");

            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);

                if (result.Error != null)
                    return BadRequest(result.Error.Message);
            }

            photo.IsDeleted = true;

            if (await uow.Complete())
                return Ok("Photo deleted successfully.");

            return BadRequest("Failed to delete photo.");
        }
    }
}