using FirstApp.WebAPI.Entities;
using FirstApp.WebAPI.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FirstApp.WebAPI.Data.Repos
{
    public class LikesRepository(AppDbContext context) : ILikesRepository
    {
        public void AddLike(MemberLike like)
        {
            context.Likes.Add(like);
        }

        public void DeleteLike(MemberLike like)
        {
            context.Likes.Remove(like);
        }

        public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId)
        {
            return await context.Likes
                .Where(m => m.SourceMemberId == memberId)
                .Select(m => m.TargetMemberId)
                .ToListAsync();
        }

        public async Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId)
        {
            return await context.Likes.FindAsync(sourceMemberId, targetMemberId);
        }

        public async Task<IReadOnlyList<Member>> GetMemberLikes(string predicte, string memberId)
        {
            var query=context.Likes.AsQueryable();
            switch (predicte)
            {
                case "liked":
                    return await query
                        .Where(m=>m.SourceMemberId==memberId)
                        .Select (m => m.TargetMember)
                        .ToListAsync();

                case "likedBy":
                    return await query
                        .Where(m=>m.TargetMemberId==memberId)
                        .Select (m => m.SourceMember)
                        .ToListAsync();
              
                default://mutual
                    var likeIds = await GetCurrentMemberLikeIds(memberId);
                    return await query
                        .Where(m=>m.TargetMemberId==memberId && likeIds.Contains(m.SourceMemberId))
                        .Select(x=>x.SourceMember).ToListAsync();
            }
        }

        public async Task<bool> SaveAllChanges()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}