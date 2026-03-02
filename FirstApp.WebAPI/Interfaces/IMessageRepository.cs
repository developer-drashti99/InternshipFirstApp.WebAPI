using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FirstApp.WebAPI.DTOs;
using FirstApp.WebAPI.Entities;
using FirstApp.WebAPI.Helpers;

namespace FirstApp.WebAPI.Interfaces
{
    public interface IMessageRepository
    {
        void AddMessage(Message message);
        void DeleteMessage(Message message);
        Task<Message?> GetMessage(string messageId);
        Task<PaginatedResult<MessageDto>> GetMessagesForMember(MessageParams messageParams);
        Task<IReadOnlyList<MessageDto>> GetMessageThread(string currentMemberId, string recipientId);
        Task<MessageDto?> GetMessageDtoById(string id);
        Task<bool> SaveAllAsync();
        //for members of the group tracking (like instant seen feature and online for message read)
        void AddGroup(Group group);
        Task RemoveConnection(string connectionId);
        Task<Connection?> GetConnection(string connectionId);
        Task<Group?> GetMessageGroup(string groupName);
        Task<Group?> GetGroupForConnection(string connectionId);
    }
}