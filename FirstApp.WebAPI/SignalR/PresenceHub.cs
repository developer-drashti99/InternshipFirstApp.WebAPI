using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace FirstApp.WebAPI.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            //for checking that who is online
            await Clients.Others.SendAsync("UserOnline", Context.User?.FindFirstValue(ClaimTypes.Email));
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await Clients.Others.SendAsync("UserOffline", Context.User?.FindFirstValue(ClaimTypes.Email));

            await base.OnDisconnectedAsync(exception);
        }
    }
}
