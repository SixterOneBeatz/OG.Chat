using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OG.Chat.Application.Common.DTOs
{
    public record class ChatMsgDTO(string? Author, string Text)
    {
        public string Author { get; init; } = Author ?? "System";

        public DateTimeOffset Created { get; init; } = DateTimeOffset.Now;
    }
}
