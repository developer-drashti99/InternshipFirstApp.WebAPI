using FirstApp.WebAPI.Entities;
using FirstApp.WebAPI.Helpers;
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

        public async Task<PaginatedResult<Member>> GetMemberLikes(LikesParams likesParams)
        {
            var query = context.Likes.AsQueryable();
            IQueryable<Member> result;

            switch (likesParams.Predicate)
            {
                case "liked":
                    result = query
                        .Where(m => m.SourceMemberId == likesParams.MemberId)
                        .Select(m => m.TargetMember);
                    break;

                case "likedBy":
                    result = query
                        .Where(m => m.TargetMemberId == likesParams.MemberId)
                        .Select(m => m.SourceMember);
                    break;

                default://mutual
                    var likeIds = await GetCurrentMemberLikeIds(likesParams.MemberId);
                    result = query
                        .Where(m => m.TargetMemberId == likesParams.MemberId && likeIds.Contains(m.SourceMemberId))
                        .Select(x => x.SourceMember);
                    break;
            }
            return await PaginationHelper.CreateAsync(result, likesParams.PageNumber, likesParams.PageSize);
        }

        public async Task<bool> SaveAllChanges()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}