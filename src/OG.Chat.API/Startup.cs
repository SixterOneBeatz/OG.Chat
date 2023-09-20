using OG.Chat.API.Hubs;
using OG.Chat.Application;
using OG.Chat.Infrastructure;
using Orleans.Hosting;

namespace OG.Chat.API
{
    public static class Startup
    {
        public static void ConfigureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddControllers();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddApplication();
            services.AddInfrastructure();
            services.AddSignalR();
            services.AddCors(options =>
            {
                string clientUrl = configuration.GetValue<string>("UrlClient") ?? string.Empty;

                options.AddPolicy("CorsPolicy", corsPolicyBuilder
                    => corsPolicyBuilder.WithOrigins(clientUrl)
                                        .AllowAnyMethod()
                                        .AllowAnyHeader()
                                        .AllowCredentials());
            });
        }

        public static void ConfigureHost(this IHostBuilder host)
            => host.UseOrleans(siloBuilder =>
            {
                siloBuilder.UseLocalhostClustering();
                siloBuilder.AddMemoryGrainStorageAsDefault();
                siloBuilder.AddSimpleMessageStreamProvider("Chat");
                siloBuilder.AddMemoryGrainStorage("PubSubStore");
            }).ConfigureLogging(logging => logging.AddConsole());

        public static void Configure(this WebApplication app)
        {
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.UseCors("CorsPolicy");
            app.MapControllers();
            app.MapHub<ChatRoomHub>("/hub");
        }
    }
}
