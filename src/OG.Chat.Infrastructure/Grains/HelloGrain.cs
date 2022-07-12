using OG.Chat.Application.Common.Interfaces;
using Orleans;

namespace OG.Chat.Infrastructure.Grains
{
    public class HelloGrain : Grain, IHelloGrain
    {
        private int _greeterCounter;
        public Task<string> SayHello(string greet)
        {
            _greeterCounter++;
            return Task.FromResult($"The Grain says: {greet}");
        }

        public Task<int> GetGreets() => Task.FromResult(_greeterCounter);
    }
}
