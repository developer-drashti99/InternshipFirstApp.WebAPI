using AutoMapper;
using FirstApp.WebAPI.DTOs;
using FirstApp.WebAPI.Entities;
using FirstApp.WebAPI.Extensions;
using FirstApp.WebAPI.Helpers;
using FirstApp.WebAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FirstApp.WebAPI.Controllers
{
    [ApiController]
    public class MessagesController(IMessageRepository messageRepository,
     IMemberRepository memberRepository) : BaseApiController
    {
        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var sender = await memberRepository.GetMemberByIdAsync(User.getMemberId());
            var recipient = await memberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);

            if (recipient == null || sender == null || sender.Id == createMessageDto.RecipientId)
                return BadRequest("Can not send message");

            var message = new Message
            {
                SenderId = sender.Id,
                RecipientId = recipient.Id,
                Content = createMessageDto.Content
            };

            messageRepository.AddMessage(message);
            if (await messageRepository.SaveAllAsync())
            {
                var messageDto = await messageRepository.GetMessageDtoById(message.Id);
                return Ok(messageDto);
            }

            return BadRequest("Failed to send message");
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<MessageDto>>> GetMessagesByContainer([FromQuery] MessageParams messageParams)
        {
            messageParams.MemberId = User.getMemberId();
            return await messageRepository.GetMessagesForMember(messageParams);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetMessageThread(string recipientId)
        {
            var currentMemberId = User.getMemberId();
            return Ok(await messageRepository.GetMessageThread(currentMemberId, recipientId));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(string id)
        {
            var memberId = User.getMemberId();

            var message = await messageRepository.GetMessage(id);

            if (message == null)
                return BadRequest("Can not delete this message.");

            if (message.SenderId != memberId && message.RecipientId != memberId)
                return BadRequest("You can not delete this message.");

            if (message.SenderId == memberId)
                message.SenderDeleted = true;

            if (message.RecipientId == memberId)
                message.RecipientDeleted = true;

            if (message is { SenderDeleted: true, RecipientDeleted: true })
            {
                messageRepository.DeleteMessage(message);
            }

            if(await messageRepository.SaveAllAsync()) return Ok();
            else return BadRequest("Problem deleting the message.");

        }

        [HttpGet("unread")]
        public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetUnreadMessages()
        {
            var memberId = User.getMemberId();
            var messages = await messageRepository.GetUnreadMessages(memberId);

            return Ok(messages);
        }

    }
}