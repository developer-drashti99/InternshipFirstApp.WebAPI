namespace FirstApp.WebAPI.Interfaces
{
    public interface IUnitOfWork
    {
        IMemberRepository memberRepository { get; }
        ILikesRepository likesRepository { get; }
        IMessageRepository messageRepository { get; }
        Task<bool> Complete();
        bool HasChanges();
    }
}
