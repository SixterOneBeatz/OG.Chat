using Microsoft.Extensions.DependencyInjection;

namespace OG.Chat.Application
{
    public static class ApplicationServicesRegistration
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            return services;
        }
    }
}
