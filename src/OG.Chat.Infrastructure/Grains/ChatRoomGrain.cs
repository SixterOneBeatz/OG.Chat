
using OG.Chat.Application.Common.DTOs;
using OG.Chat.Application.Common.Interfaces;
using Orleans;
using Orleans.Streams;

namespace OG.Chat.Infrastructure.Grains
{
    public class ChatRoomGrain : Grain, IChatRoomGrain
    {
        private readonly List<ChatMsgDTO> _messages = new();
        private readonly List<string> _onlineMembers = new();

        private IAsyncStream<ChatMsgDTO> _stream = null!;

        public override Task OnActivateAsync()
        {
            var streamProvider = GetStreamProvider("Chat");

            _stream = streamProvider.GetStream<ChatMsgDTO>(Guid.NewGuid(), this.GetPrimaryKeyString());

            return base.OnActivateAsync();
        }

        public Task<string[]> GetMembers() => Task.FromResult(_onlineMembers.ToArray());

        public async Task<Guid> Join(string nickname)
        {
            _onlineMembers.Add(nickname);

            await _stream.OnNextAsync(new("System", $"{nickname} joins the chat '{this.GetPrimaryKeyString()}' ..."));

            return _stream.Guid;
        }

        public async Task<Guid> Leave(string nickname)
        {
            _onlineMembers.Remove(nickname);

            await _stream.OnNextAsync(new("System", $"{nickname} leaves the chat '{this.GetPrimaryKeyString()}' ..."));

            if (_onlineMembers.Count == 0)
            {
                await base.OnDeactivateAsync();
            }

            return _stream.Guid;
        }

        public async Task SendMessage(ChatMsgDTO message)
        {
            _messages.Add(message);

            await _stream.OnNextAsync(message);
        }

        public Task<ChatMsgDTO[]> ReadHistory(int numberOfMessages)
        {
            var response = _messages
                .OrderByDescending(x => x.Created)
                .Take(numberOfMessages)
                .OrderBy(x => x.Created)
                .ToArray();

            return Task.FromResult(response);
        }
    }
}
