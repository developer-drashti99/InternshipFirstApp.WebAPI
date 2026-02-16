using FirstApp.WebAPI.Entities;

namespace FirstApp.WebAPI.Interfaces
{
    public interface ILikesRepository
    {
        Task<MemberLike?> GetMemberLike(string sourceMemberId,string targetMemberId);
        Task<IReadOnlyList<Member>> GetMemberLikes(string predicte,string memberId);//kind of list
        Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId);
        void DeleteLike(MemberLike like);
        void AddLike(MemberLike like);

        Task<bool> SaveAllChanges();
    }
}
