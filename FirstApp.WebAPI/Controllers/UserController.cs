using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FirstApp.WebAPI.Interfaces;
using FirstApp.WebAPI.Entities;
using FirstApp.WebAPI.DTOs;
using FirstApp.WebAPI.Extensions;
using FirstApp.WebAPI.Helpers;
using Microsoft.AspNetCore.Identity;
using FirstApp.WebAPI.Services;
using System.Collections.Concurrent;
namespace FirstApp.WebAPI.Controllers
{
    [Authorize]
    public class UsersController(IUnitOfWork uow, IPhotoService photoService,
    UserManager<AppUser> userManager, EmailService emailService) : BaseApiController
    {
        private static ConcurrentDictionary<string, string> OtpData = new();

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetUsers([FromQuery] MemberParams memberParams)
        {
            try
            {
                memberParams.CurrentMemberId = User.getMemberId();

                return Ok(await uow.memberRepository.GetMembersAsync(memberParams));
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
                var member = await uow.memberRepository.GetMemberByIdAsync(Id);
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

        [HttpPost("change-pwd")]
        public async Task<ActionResult> ChangePassword(ChangePasswordDto changePassword)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage));
            }

            var userId = User.getMemberId();

            if (userId == null)
                return BadRequest(new {message="Please login to your account."});

            var user = await userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound("User not found.");


            var isOldPasswordCorrect = await userManager.CheckPasswordAsync(user, changePassword.OldPassword);

            if (!isOldPasswordCorrect)
                return BadRequest(new {message="Incorrect old password."});

            var result = await userManager.ChangePasswordAsync(
                user,
                changePassword.OldPassword,
                changePassword.NewPassword
            );

            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(e => e.Description));

            return Ok(new { message = "Password has been changed." });
        }

        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
        {
            return Ok(await uow.memberRepository.GetPhotosForMemberAsync(id, User.getMemberId() == id));
        }

        [HttpPost]
        public ActionResult AddUser([FromBody] AppUser user)
        {
            try
            {
                // context.Users.Add(user);
                uow.Complete();
                return Ok(new {message=$"User Added Successfully having the Id {user.Id}"});
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
            // if (memberId == null) return BadRequest(new {message="Oops - no id found in token");
            var memberId = User.getMemberId();

            var member = await uow.memberRepository.GetMemberForUpdate(memberId);
            if (member == null) return BadRequest(new {message="Could not get member"});

            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;

            // update displayname in user also
            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;

            uow.memberRepository.Update(member); //optional

            if (await uow.Complete()) return NoContent();
            return BadRequest(new {message="Fail to update member"});
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)//name should be file 
        {
            var member = await uow.memberRepository.GetMemberForUpdate(User.getMemberId());
            if (member == null) return BadRequest(new {message="Cannot update member"});

            var result = await photoService.UploadPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = User.getMemberId(),
            };
            // if (member.ImageUrl == null)
            // {
            //     member.ImageUrl = photo.Url;
            //     member.User.ImageUrl = photo.Url;
            // }
            // ;
            member.Photos.Add(photo);

            if (await uow.Complete()) return photo;

            return BadRequest(new {message="Problem adding photo"});
        }


        //setting up the image as a profile photo
        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var member = await uow.memberRepository.GetMemberForUpdate(User.getMemberId());
            if (member == null) return BadRequest(new {message="Cannot get member from token"});

            var photo = member.Photos.FirstOrDefault(m => m.Id == photoId);

            if (member.ImageUrl == photo?.Url || photo == null) return BadRequest(new {message="Cannot set this as main image"});

            member.ImageUrl = photo?.Url;
            member.User.ImageUrl = photo?.Url;

            if (await uow.Complete()) return NoContent();

            return BadRequest(new {message="Problem in setting main photo"});
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var member = await uow.memberRepository.GetMemberForUpdate(User.getMemberId());
            if (member == null) return BadRequest(new {message="Cannot get member from token"});

            var photo = member.Photos.FirstOrDefault(m => m.Id == photoId);
            if (photo == null || photo.Url == member.ImageUrl)
                return BadRequest(new {message="This photo can not be deleted"});

            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            photo.IsDeleted = true;
            if (await uow.Complete()) return Ok();

            return BadRequest(new {message="Problem in deleting the photo"});
        }

        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
        {
            var user = await userManager.FindByEmailAsync(dto.Email);

            if (user == null) return BadRequest(new {message="Unable to process the request at the moment." });

            var token = await userManager.GeneratePasswordResetTokenAsync(user);

            OtpData[dto.Email] = Random.Shared.Next(100000,999999).ToString();
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
  {OtpData[dto.Email]}
  </div>

  <p>This OTP will expire in <b>30 minutes</b>.</p>

  <p style='color:gray;font-size:12px'>
  If you did not request this, please ignore this email.
  </p>
</div>
";
            try
            {
                await emailService.SendEmailAsync(dto.Email, "Reset Password", body);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return Ok(new { message = "Password reset email sent" });
        }

        [AllowAnonymous]
        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp(VerifyOtpDto dto)
        {
            if (!OtpData.TryGetValue(dto.Email, out var storedOtp))
                return BadRequest(new {message="OTP not found"});

            if (storedOtp != dto.Otp)
                return BadRequest(new {message="Invalid OTP"});

            return Ok(new { message = "OTP verified" });
        }
        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
        {
            var user = await userManager.FindByEmailAsync(dto.Email);

            if (user == null)
                return BadRequest(new {message="User not found"});

            var token = await userManager.GeneratePasswordResetTokenAsync(user);

            var result = await userManager.ResetPasswordAsync(user, token, dto.NewPassword);

            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(e => e.Description));

            OtpData.TryRemove(dto.Email, out _);

            return Ok(new { message = "Password reset successfully" });
        }
    }


}
