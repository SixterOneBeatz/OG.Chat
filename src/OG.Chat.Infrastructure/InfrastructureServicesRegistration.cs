using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Orleans.Hosting;

namespace OG.Chat.Infrastructure
{
    public static class InfrastructureServicesRegistration
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            return services;
        }

        public static IHostBuilder InfrastructureHosting(this IHostBuilder host)
        {
            return host.UseOrleans(siloBuilder =>
            {
                siloBuilder.UseLocalhostClustering();
                siloBuilder.AddMemoryGrainStorageAsDefault();
                siloBuilder.AddSimpleMessageStreamProvider("Chat");
                siloBuilder.AddMemoryGrainStorage("PubSubStore");
            });
        }
    }
}
