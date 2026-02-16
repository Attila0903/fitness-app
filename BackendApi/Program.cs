using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors( options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
       policy.WithOrigins("http://localhost:5173")
       .AllowAnyHeader()
       .AllowAnyMethod(); 
    });    
}
);

builder.Services.AddDbContext<FitnessDbContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("ReactPolicy"); // CORS bekapcsolása
app.UseHttpsRedirection();

app.Run();