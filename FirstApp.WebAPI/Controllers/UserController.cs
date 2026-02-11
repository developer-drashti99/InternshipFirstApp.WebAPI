using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FirstApp.WebAPI.Interfaces;
using FirstApp.WebAPI.Entities;
using FirstApp.WebAPI.DTOs;
using FirstApp.WebAPI.Extensions;
namespace FirstApp.WebAPI.Controllers
{
    [Authorize]
    public class UsersController(IMemberRepository memberRepository, IPhotoService photoService) : BaseApiController
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

        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            // var memberId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            // if (memberId == null) return BadRequest("Oops - no id found in token");
            var memberId = User.getMemberId();

            var member = await memberRepository.GetMemberForUpdate(memberId);
            if (member == null) return BadRequest("Could not get member");

            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;

            // update displayname in user also
            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;

            memberRepository.Update(member); //optional

            if (await memberRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Fail to update member");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)//name should be file 
        {
            var member = await memberRepository.GetMemberForUpdate(User.getMemberId());
            if (member == null) return BadRequest("Cannot update member");

            var result = await photoService.UploadPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = User.getMemberId(),
            };
            if (member.ImageUrl == null)
            {
                member.ImageUrl = photo.Url;
                member.User.ImageUrl = photo.Url;
            }
            ;
            member.Photos.Add(photo);

            if (await memberRepository.SaveAllAsync()) return photo;

            return BadRequest("Problem adding photo");
        }


        //setting up the image as a profile photo
        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var member = await memberRepository.GetMemberForUpdate(User.getMemberId());
            if (member == null) return BadRequest("Cannot get member from token");

            var photo = member.Photos.FirstOrDefault(m => m.Id == photoId);

            if (member.ImageUrl == photo?.Url || photo == null) return BadRequest("Cannot set this as main image");

            member.ImageUrl = photo?.Url;
            member.User.ImageUrl = photo?.Url;

            if (await memberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Problem in setting main photo");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var member = await memberRepository.GetMemberForUpdate(User.getMemberId());
            if (member == null) return BadRequest("Cannot get member from token");

            var photo = member.Photos.FirstOrDefault(m => m.Id == photoId);
            if (photo == null || photo.Url == member.ImageUrl)
                return BadRequest("This photo can not be deleted");

            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            member.Photos.Remove(photo);
            if (await memberRepository.SaveAllAsync()) return Ok();
            
            return BadRequest("Problem in deleting the photo");
        }

    }

}
