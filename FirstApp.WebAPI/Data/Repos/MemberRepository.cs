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
