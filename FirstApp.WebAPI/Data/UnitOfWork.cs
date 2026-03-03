using AutoMapper;
using FirstApp.WebAPI.Data.Repos;
using FirstApp.WebAPI.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FirstApp.WebAPI.Data
{
    public class UnitOfWork(
        AppDbContext context,
        UserManager<AppUser> userManager,
        IMapper mapper
        ) : IUnitOfWork
    {
        private IMemberRepository? _memberRepository;
        private IMessageRepository? _messageRepository;
        private ILikesRepository? _likesRepository;

        public IMemberRepository memberRepository => _memberRepository ??= new MemberRepository(context, userManager,mapper);

        public ILikesRepository likesRepository => _likesRepository ??= new LikesRepository(context);

        public IMessageRepository messageRepository => _messageRepository ??= new MessageRepository(context, mapper);

        public async Task<bool> Complete()
        {
            try
            {
                return await context.SaveChangesAsync() > 0;
            }
            catch (DbUpdateException ex)
            {
                throw new Exception("An error occured while saving changes ",ex);
                throw;
            }
        }

        public bool HasChanges()
        {
            return context.ChangeTracker.HasChanges();
        }
    }
}
