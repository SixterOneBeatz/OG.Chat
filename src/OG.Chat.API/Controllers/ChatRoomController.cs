using Microsoft.AspNetCore.Mvc;
using OG.Chat.Application.Common.DTOs;
using OG.Chat.Application.Common.Interfaces;
using Orleans;

namespace OG.Chat.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatRoomController : ControllerBase
    {
        private readonly IClusterClient _clusterClient;

        public ChatRoomController(IClusterClient clusterClient)
        {
            _clusterClient = clusterClient;
        }

        [HttpPost("Join")]
        public async Task<IActionResult> Join([FromBody] UserDTO user)
        {
            var grain = _clusterClient.GetGrain<IChatRoomGrain>(user.RoomName);
            Guid response = await grain.Join(user.NickName);
            return Ok(response);
        }

        [HttpPost("Leave")]
        public async Task<IActionResult> Leave([FromBody] UserDTO user)
        {
            var grain = _clusterClient.GetGrain<IChatRoomGrain>(user.RoomName);
            var response = await grain.Leave(user.NickName);
            return Ok(response);
        }

        [HttpPost("SendMessage/{roomname}")]
        public async Task<IActionResult> SendMessage(string roomname, [FromBody] ChatMsgDTO msg)
        {
            var grain = _clusterClient.GetGrain<IChatRoomGrain>(roomname);
            await grain.SendMessage(msg);
            return Ok();
        }

        [HttpGet("GetMessages/{roomname}")]
        public async Task<ActionResult<IEnumerable<ChatMsgDTO>>> GetMessages(string roomname)
        {
            var grain = _clusterClient.GetGrain<IChatRoomGrain>(roomname);
            var response = await grain.ReadHistory();
            return Ok(response);
        }
    }
}
