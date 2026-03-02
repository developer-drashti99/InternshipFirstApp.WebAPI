using AutoMapper;
using FirstApp.WebAPI.DTOs;
using FirstApp.WebAPI.Entities;
using FirstApp.WebAPI.Extensions;
using FirstApp.WebAPI.Interfaces;
using FirstApp.WebAPI.Mapping;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace FirstApp.WebAPI.SignalR
{
    [Authorize]
    public class MessageHub(IMessageRepository messageRepository, IMemberRepository memberRepository, IHubContext<PresenceHub> presenceHub) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            //http request to setup SignalR connection
            var httpContext = Context.GetHttpContext();

            var otherUser = httpContext?.Request.Query["userId"].ToString() ?? throw new HubException("Other user not found");

            var groupName = GetGroupName(GetUserId(), otherUser);

            //signalR group
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            //custom group (db entity)
            await AddToGroup(groupName);

            var messages = await messageRepository.GetMessageThread(GetUserId(), otherUser);

            await Clients.Group(groupName).SendAsync("RecieveMessageThread", messages);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await messageRepository.RemoveConnection(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var sender = await memberRepository.GetMemberByIdAsync(GetUserId());
            var recipient = await memberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);

            if (recipient == null || sender == null || sender.Id == createMessageDto.RecipientId)
                throw new HubException("Can not send message");

            var message = new Message
            {
                SenderId = sender.Id,
                RecipientId = recipient.Id,
                Content = createMessageDto.Content
            };

            //updating message read status
            var groupName = GetGroupName(sender.Id, recipient.Id);
            var group = await messageRepository.GetMessageGroup(groupName);
            var userInGroup = group != null &&
                group.Connections
                .Any(u => u.UserId == message.RecipientId);


            if (userInGroup)
            {
                message.DateRead = DateTime.UtcNow;
            }


            messageRepository.AddMessage(message);
            if (await messageRepository.SaveAllAsync())
            {
                //using AutoMapper
                var messageDto = await messageRepository.GetMessageDtoById(message.Id);

                await Clients.Group(groupName).SendAsync("NewMessage", messageDto);
                var connection = await PresenceTracker.GetConnectionsForUser(recipient.Id);
                if (connection != null && connection.Count > 0 && !userInGroup)
                {
                    await presenceHub.Clients.Clients(connection).SendAsync("NewMessageReceived", messageDto);
                }
            }
        }

        private async Task<bool> AddToGroup(string groupName)
        {
            var group = await messageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, GetUserId());
            if (group == null)
            {
                group = new Group(groupName);
                messageRepository.AddGroup(group);
            }
            group.Connections.Add(connection);
            return await messageRepository.SaveAllAsync();
        }

        private string GetGroupName(string? caller, string? other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }

        private string GetUserId()
        {
            return Context.User?.getMemberId()
                ?? throw new HubException("can not get memberId");
        }
    }
}
