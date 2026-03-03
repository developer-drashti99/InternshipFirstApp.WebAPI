using FirstApp.WebAPI.DTOs;
using FirstApp.WebAPI.Entities;
using FirstApp.WebAPI.Entities.enums;
using FirstApp.WebAPI.Helpers;

namespace FirstApp.WebAPI.Interfaces;

public interface IMemberRepository
{
    void Update(Member member);
    //Task<bool> SaveAllAsync();
    Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams);
    Task<Member?> GetMemberByIdAsync(string id);
    Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId, bool includeUnapproved = false);
    Task<Member?> GetMemberForUpdate(string id);
    public Task<PaginatedResult<UserWithRolesDto>> GetUsersWithRolesAsync(UserParams userParams);
    public Task<PaginatedResult<PhotoForModerationDto>> GetUnapprovedPhotosAsync(int pageNumber, int pageSize);

    public Task ModeratePhoto(int photoId, PhotoModerationAction action);

}