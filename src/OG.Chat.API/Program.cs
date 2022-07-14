using OG.Chat.API;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.ConfigureServices(configuration);
builder.Host.ConfigureHost();

var app = builder.Build();

app.Configure();
app.Run();