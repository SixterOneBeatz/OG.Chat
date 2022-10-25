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

        [HttpGet("Join/{nickname}")]
        public async Task<IActionResult> Join(string nickname)
        {
            var grain = _clusterClient.GetGrain<IChatRoomGrain>("DefaultGrain");
            Guid response = await grain.Join(nickname);

            _stream = _clusterClient.GetStreamProvider("Chat").GetStream<ChatMsgDTO>(response, "default");

            var subscriptionHandlers = await _stream.GetAllSubscriptionHandles();
            if (!subscriptionHandlers.Any())
                await _stream.SubscribeAsync(new ChatStreamObserver("DefaultGrain", _hubContext));

            return Ok(response);
        }

        [HttpGet("Leave/{nickname}")]
        public async Task<IActionResult> Leave(string nickname)
        {
            var grain = _clusterClient.GetGrain<IChatRoomGrain>("DefaultGrain");
            var response = await grain.Leave(nickname);
            _stream = _clusterClient.GetStreamProvider("Chat").GetStream<ChatMsgDTO>(response, "default");

            var subscriptionHandlers = await _stream.GetAllSubscriptionHandles();

            var members = await grain.GetMembers();

            if (!members.Any())
                foreach (var handle in subscriptionHandlers)
                    await handle.UnsubscribeAsync();

            return Ok(response);
        }

        [HttpPost("SendMessage")]
        public async Task<IActionResult> SendMessage(ChatMsgDTO msg)
        {
            var grain = _clusterClient.GetGrain<IChatRoomGrain>("DefaultGrain");
            await grain.SendMessage(msg);
            return Ok();
        }
    }
}
