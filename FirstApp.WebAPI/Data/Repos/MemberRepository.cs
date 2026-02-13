using FirstApp.WebAPI.Entities;
using FirstApp.WebAPI.Helpers;
using FirstApp.WebAPI.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FirstApp.WebAPI.Data.Repos;

public class MemberRepository(AppDbContext context) : IMemberRepository
{
    public async Task<Member?> GetMemberByIdAsync(string id)
    {
        return await context.Members.FindAsync(id);
    }

    public async Task<PaginatedResult<Member>> GetMembersAsync(PagingParams pagingParams)
    {
        var query = context.Members.Include(x => x.Photos).AsQueryable();

        return await PaginationHelper.CreateAsync(query, pagingParams.PageNumber, pagingParams.PageSize);
    }

    public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId)
    {
        return await context.Members
        .Where(m => m.Id == memberId)
        .SelectMany(m => m.Photos)
        .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

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
}
