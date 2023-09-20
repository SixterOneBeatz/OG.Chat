
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using OG.Chat.Application.Common.DTOs;
using OG.Chat.Application.Common.Interfaces;
using OG.Chat.Infrastructure.Hubs;
using OG.Chat.Infrastructure.Observers;
using Orleans;
using Orleans.Streams;

namespace OG.Chat.Infrastructure.Grains
{
    public class ChatRoomGrain : Grain, IChatRoomGrain
    {
        private readonly List<ChatMsgDTO> _messages = new();
        private readonly List<string> _onlineMembers = new();

        private IAsyncStream<ChatMsgDTO> _stream = null!;
        private IHubContext<ChatRoomHub> _hubContext = null!;

        public override Task OnActivateAsync()
        {
            var streamProvider = GetStreamProvider("Chat");

            _stream = streamProvider.GetStream<ChatMsgDTO>(Guid.NewGuid(), this.GetPrimaryKeyString());

            _hubContext = ServiceProvider.GetRequiredService<IHubContext<ChatRoomHub>>();

            return base.OnActivateAsync();
        }

        public Task<string[]> GetMembers() => Task.FromResult(_onlineMembers.ToArray());

        public async Task<Guid> Join(string nickname)
        {
            _onlineMembers.Add(nickname);

            var subscriptionHandlers = await _stream.GetAllSubscriptionHandles();
            if (!subscriptionHandlers.Any())
                await _stream.SubscribeAsync(new ChatStreamObserver(this.GetPrimaryKeyString(), _hubContext));

            await _stream.OnNextAsync(new("System", $"{nickname} joins the chat '{this.GetPrimaryKeyString()}' ..."));

            return _stream.Guid;
        }

        public async Task<Guid> Leave(string nickname)
        {
            _onlineMembers.Remove(nickname);

            await _stream.OnNextAsync(new("System", $"{nickname} leaves the chat '{this.GetPrimaryKeyString()}' ..."));

            if (_onlineMembers.Count == 0)
            {
                var subscriptionHandlers = await _stream.GetAllSubscriptionHandles();
                foreach (var handle in subscriptionHandlers)
                    await handle.UnsubscribeAsync();
                await base.OnDeactivateAsync();
            }

            return _stream.Guid;
        }

        public async Task SendMessage(ChatMsgDTO message)
        {
            _messages.Add(message);

            await _stream.OnNextAsync(message);
        }

        public async Task<IEnumerable<ChatMsgDTO>> ReadHistory()
        {
            var response = _messages.OrderByDescending(x => x.Created).ToList();

            return await Task.FromResult(response);
        }
    }
}
