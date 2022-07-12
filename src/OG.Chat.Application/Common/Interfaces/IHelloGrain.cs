using Orleans;

namespace OG.Chat.Application.Common.Interfaces
{
    public interface IHelloGrain : IGrainWithStringKey
    {
        Task<string> SayHello(string greet);
        Task<int> GetGreets();
    }
}
