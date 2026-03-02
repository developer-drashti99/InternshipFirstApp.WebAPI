using FirstApp.WebAPI.Entities;
using FirstApp.WebAPI.Helpers;

namespace FirstApp.WebAPI.Interfaces
{
    public interface ILikesRepository
    {
        Task<MemberLike?> GetMemberLike(string sourceMemberId,string targetMemberId);
        Task<PaginatedResult<Member>> GetMemberLikes(LikesParams likesParams);
        Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId);
        void DeleteLike(MemberLike like);
        void AddLike(MemberLike like);

        //Task<bool> SaveAllChanges();
    }
}
