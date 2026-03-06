using AutoMapper;
using AutoMapper.QueryableExtensions;
using FirstApp.WebAPI.DTOs;
using FirstApp.WebAPI.Entities;
using FirstApp.WebAPI.Entities.enums;
using FirstApp.WebAPI.Helpers;
using FirstApp.WebAPI.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FirstApp.WebAPI.Data.Repos;

public class MemberRepository(AppDbContext context, UserManager<AppUser> userManager, IMapper mapper) : IMemberRepository
{
    public async Task<Member?> GetMemberByIdAsync(string id)
    {
        return await context.Members.FindAsync(id);
    }

    public async Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams)
    {
        var query = context.Members.Include(x => x.Photos).AsQueryable();

        query = query.Where(m => m.Id != memberParams.CurrentMemberId);

        if (memberParams.Gender != null)
            query = query.Where(m => m.Gender == memberParams.Gender);

        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge - 1));

        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));

        query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);

        query = memberParams.OrderBy switch
        {
            "created" => query.OrderByDescending(m => m.Created),
            _ => query.OrderByDescending(m => m.LastActive)
        };


        return await PaginationHelper.CreateAsync(query, memberParams.PageNumber, memberParams.PageSize);
    }

    public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(
     string memberId,
     bool includeUnapproved = false)
    {
        var query = context.Photos
            .Where(p => p.MemberId == memberId);

        if (!includeUnapproved)
        {
            query = query.Where(p => p.IsApproved);
        }

        return await query.ToListAsync();
    }

    //public async Task<bool> SaveAllAsync()
    //{
    //    return await context.SaveChangesAsync() > 0;
    //}

    public void Update(Member member)
    {
        context.Entry(member).State = EntityState.Modified;
    }
    //get member object with user also
    async Task<Member?> IMemberRepository.GetMemberForUpdate(string id)
    {
        return await context.Members
        .Include(m => m.User)
        .Include(m => m.Photos)
        .SingleOrDefaultAsync(m => m.Id == id);
    }

    public async Task<PaginatedResult<UserWithRolesDto>> GetUsersWithRolesAsync(UserParams userParams)
    {
        var query = userManager.Users.AsQueryable();

        // 🔎 Search
        if (!string.IsNullOrEmpty(userParams.Search))
        {
            query = query.Where(u =>
                u.UserName!.ToLower().Contains(userParams.Search.ToLower()) ||
                u.Email!.ToLower().Contains(userParams.Search.ToLower()));
        }

        // 📊 Sorting
        query = userParams.OrderBy switch
        {
            "email" => query.OrderBy(u => u.Email),
            _ => query.OrderBy(u => u.UserName)
        };

        // ⚡ Use pagination helper FIRST
        var pagedUsers = await PaginationHelper.CreateAsync(
            query,
            userParams.PageNumber,
            userParams.PageSize
        );

        var usersWithRoles = new List<UserWithRolesDto>();

        foreach (var user in pagedUsers.Items)
        {
            var roles = await userManager.GetRolesAsync(user);

            usersWithRoles.Add(new UserWithRolesDto
            {
                Id = user.Id,
                UserName = user.UserName!,
                Email = user.Email!,
                Roles = roles
            });
        }

        return new PaginatedResult<UserWithRolesDto>
        {
            Items = usersWithRoles,
            Metadata = pagedUsers.Metadata
        };
    }

    public async Task<PaginatedResult<PhotoForModerationDto>>
     GetUnapprovedPhotosAsync(int pageNumber, int pageSize)
    {
        var query = context.Photos
            .Where(p => !p.IsApproved)
            .ProjectTo<PhotoForModerationDto>(mapper.ConfigurationProvider);

        return await PaginationHelper
        .CreateAsync(query, pageNumber, pageSize);
    }

    public async Task ModeratePhoto(int photoId, PhotoModerationAction action)
    {
        //var photo = await context.Photos.FindAsync(photoId);
        var photo = await context.Photos
      .Include(p => p.Member)
          .ThenInclude(m => m.User)
      .Include(p => p.Member.Photos)
      .FirstOrDefaultAsync(p => p.Id == photoId);
        if (photo == null)
            throw new Exception("Photo not found");
        switch (action)
        {
            case PhotoModerationAction.Approve:
                photo.IsApproved = true;
                
                // if (photo.Member.User.ImageUrl == null && photo.Member.ImageUrl == null)
                // {
                //     photo.Member.User.ImageUrl = photo.Url;
                //     photo.Member.ImageUrl = photo.Url;
                // }
                break;

            case PhotoModerationAction.Reject:
                photo.IsDeleted = true;
                photo.Member.User.ImageUrl = null;
                break;
        }

        await context.SaveChangesAsync();

    }

}
