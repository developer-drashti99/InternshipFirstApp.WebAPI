using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using FirstApp.WebAPI.DTOs;
using FirstApp.WebAPI.Entities;
using FirstApp.WebAPI.Helpers;
using FirstApp.WebAPI.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FirstApp.WebAPI.Data.Repos
{
    public class MessageRepository(AppDbContext context, IMapper _mapper) : IMessageRepository
    {
        public void AddGroup(Group group)
        {
            context.Groups.Add(group);
        }

        public void AddMessage(Message message)
        {
            context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            context.Messages.Remove(message);
        }

        public async Task<Connection?> GetConnection(string connectionId)
        {
            return await context.Connections.FindAsync(connectionId);
        }

        public async Task<Group?> GetGroupForConnection(string connectionId)
        {
            return await context.Groups
                .Include(g => g.Connections)
                .Where(g => g.Connections.Any(c => c.ConnectionId == connectionId))
                .FirstOrDefaultAsync();
        }

        public async Task<Message?> GetMessage(string messageId)
        {
            return await context.Messages.FindAsync(messageId);
        }

        public async Task<MessageDto?> GetMessageDtoById(string id)
        {
            return await context.Messages
            .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(m => m.Id == id);
        }

        public async Task<Group?> GetMessageGroup(string groupName)
        {
            return await context.Groups
                .Include(g => g.Connections)
                .FirstOrDefaultAsync(g => g.Name == groupName);
        }

        public async Task<PaginatedResult<MessageDto>> GetMessagesForMember(MessageParams messageParams)
        {
            var query = context.Messages
                .OrderByDescending(m => m.MessageSent)
                .AsQueryable();

            query = messageParams.Container
                switch
            {
                "Outbox" => query.Where(m => m.SenderId == messageParams.MemberId && m.SenderDeleted == false),
                _ => query.Where(m => m.RecipientId == messageParams.MemberId
                && m.RecipientDeleted == false)
            };

            //used automapper to project the query to MessageDto, which is more efficient than fetching the entire Message entity and then mapping it in memory
            var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);

            return await PaginationHelper.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IReadOnlyList<MessageDto>> GetMessageThread(
       string currentMemberId,
       string recipientId)
        {
            // Mark messages as read (where current user is recipient)
            await context.Messages
                .Where(m =>
                    m.RecipientId == currentMemberId &&
                    m.SenderId == recipientId &&
                    m.DateRead == null)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(m => m.DateRead, DateTime.UtcNow));

            return await context.Messages
                .Where(m =>
                    (m.RecipientId == currentMemberId &&
                    m.SenderId == recipientId &&
                    !m.RecipientDeleted)
                    ||
                    (m.SenderId == currentMemberId &&
                    m.RecipientId == recipientId &&
                    !m.SenderDeleted)
                )
                .OrderBy(m => m.MessageSent)
                .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task RemoveConnection(string connectionId)
        {
            await context.Connections
                .Where(c => c.ConnectionId == connectionId)
                .ExecuteDeleteAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}