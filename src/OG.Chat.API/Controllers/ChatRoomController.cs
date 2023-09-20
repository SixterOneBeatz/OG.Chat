using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using OG.Chat.API.Hubs;
using OG.Chat.API.Observers;
using OG.Chat.Application.Common.DTOs;
using OG.Chat.Application.Common.Interfaces;
using Orleans;
using Orleans.Streams;

namespace OG.Chat.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatRoomController : ControllerBase
    {
        private readonly IClusterClient _clusterClient;
        private readonly IHubContext<ChatRoomHub> _hubContext;
        private IAsyncStream<ChatMsgDTO> _stream = null!;

        public ChatRoomController(IClusterClient clusterClient, IHubContext<ChatRoomHub> hubContext)
        {
            _clusterClient = clusterClient;
            _hubContext = hubContext;
        }

        [HttpPost("Join")]
        public async Task<IActionResult> Join([FromBody] UserDTO user)
        {
            var grain = _clusterClient.GetGrain<IChatRoomGrain>(user.RoomName);
            Guid response = await grain.Join(user.NickName);

            _stream = _clusterClient.GetStreamProvider("Chat").GetStream<ChatMsgDTO>(response, user.RoomName);

            var subscriptionHandlers = await _stream.GetAllSubscriptionHandles();
            if (!subscriptionHandlers.Any())
                await _stream.SubscribeAsync(new ChatStreamObserver(user.RoomName, _hubContext));

            return Ok(response);
        }

        [HttpPost("Leave")]
        public async Task<IActionResult> Leave([FromBody] UserDTO user)
        {
            var grain = _clusterClient.GetGrain<IChatRoomGrain>(user.RoomName);
            var response = await grain.Leave(user.NickName);
            _stream = _clusterClient.GetStreamProvider("Chat").GetStream<ChatMsgDTO>(response, user.RoomName);

            var subscriptionHandlers = await _stream.GetAllSubscriptionHandles();

            var members = await grain.GetMembers();

            if (!members.Any())
                foreach (var handle in subscriptionHandlers)
                    await handle.UnsubscribeAsync();

            return Ok(response);
        }

        [HttpPost("SendMessage/{roomname}")]
        public async Task<IActionResult> SendMessage(string roomname, [FromBody] ChatMsgDTO msg)
        {
            var grain = _clusterClient.GetGrain<IChatRoomGrain>(roomname);
            await grain.SendMessage(msg);
            return Ok();
        }
    }
}
