using AI.DocumentAssistant.API.Data;
using Microsoft.EntityFrameworkCore;
using AI.DocumentAssistant.API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddScoped<EmbeddingService>();
builder.Services.AddHttpClient<AIService>();

var app = builder.Build();

app.MapControllers();

app.Run();