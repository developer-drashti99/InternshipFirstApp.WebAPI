using FirstApp.WebAPI.DTOs;
using FirstApp.WebAPI.Entities;
using FirstApp.WebAPI.Extensions;
using FirstApp.WebAPI.Helpers;
using FirstApp.WebAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FirstApp.WebAPI.Controllers
{
    [ApiController]
    public class MessagesController(IUnitOfWork uow) : BaseApiController
    {
        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var senderId = User.getMemberId();

            var sender = await uow.memberRepository.GetMemberByIdAsync(senderId);
            var recipient = await uow.memberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);

            if (sender == null || recipient == null)
                return BadRequest("Sender or recipient could not be found.");

            if (senderId == createMessageDto.RecipientId)
                return BadRequest("You cannot send a message to yourself.");

            var message = new Message
            {
                SenderId = sender.Id,
                RecipientId = recipient.Id,
                Content = createMessageDto.Content
            };

            uow.messageRepository.AddMessage(message);

            if (!await uow.Complete())
                return BadRequest("Failed to send the message.");

            var messageDto = await uow.messageRepository.GetMessageDtoById(message.Id);

            return Ok(messageDto);
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<MessageDto>>> GetMessagesByContainer(
            [FromQuery] MessageParams messageParams)
        {
            messageParams.MemberId = User.getMemberId();

            var messages = await uow.messageRepository.GetMessagesForMember(messageParams);

            return Ok(messages);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetMessageThread(string recipientId)
        {
            var currentMemberId = User.getMemberId();

            var thread = await uow.messageRepository.GetMessageThread(currentMemberId, recipientId);

            return Ok(thread);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(string id)
        {
            var memberId = User.getMemberId();

            var message = await uow.messageRepository.GetMessage(id);

            if (message == null)
                return NotFound("Message not found.");

            if (message.SenderId != memberId && message.RecipientId != memberId)
                return BadRequest("You are not authorized to delete this message.");

            if (message.SenderId == memberId)
                message.SenderDeleted = true;

            if (message.RecipientId == memberId)
                message.RecipientDeleted = true;

            // physical delete only if both deleted
            if (message.SenderDeleted && message.RecipientDeleted)
                uow.messageRepository.DeleteMessage(message);

            if (!await uow.Complete())
                return BadRequest("Failed to delete the message.");

            return Ok("Message deleted successfully.");
        }

        [HttpGet("unread")]
        public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetUnreadMessages()
        {
            var memberId = User.getMemberId();

            var messages = await uow.messageRepository.GetUnreadMessages(memberId);

            return Ok(messages);
        }
    }
}