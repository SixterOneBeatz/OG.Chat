using OG.Chat.Application.Common.DTOs;
using Orleans;

namespace OG.Chat.Application.Common.Interfaces
{
    public interface IChatRoomGrain : IGrainWithStringKey
    {
        Task<Guid> Join(string nickname);
        Task<Guid> Leave(string nickname);
        Task SendMessage(ChatMsgDTO message);
        Task<IEnumerable<ChatMsgDTO>> ReadHistory();
        Task<string[]> GetMembers();
    }
}
