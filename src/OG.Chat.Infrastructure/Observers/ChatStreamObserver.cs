﻿using Microsoft.AspNetCore.SignalR;
using OG.Chat.Application.Common.DTOs;
using OG.Chat.Infrastructure.Hubs;
using Orleans.Streams;

namespace OG.Chat.Infrastructure.Observers
{
    public class ChatStreamObserver : IAsyncObserver<ChatMsgDTO>
    {
        private readonly string _roomName;
        private readonly IHubContext<ChatRoomHub> _hubContext;

        public ChatStreamObserver(string roomName, IHubContext<ChatRoomHub> hubContext)
        {
            _roomName = roomName;
            _hubContext = hubContext;
        }

        public Task OnCompletedAsync() => Task.CompletedTask;

        public Task OnErrorAsync(Exception ex) => Task.CompletedTask;

        public async Task OnNextAsync(ChatMsgDTO item, StreamSequenceToken? token = null)
            => await _hubContext.Clients.All.SendAsync("SendMessage", item);
    }
}
