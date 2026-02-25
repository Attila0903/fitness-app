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

builder.Services.AddControllers();

builder.Services.AddDbContext<FitnessDbContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<FitnessDbContext>();
    var logger = services.GetRequiredService<ILogger<Program>>();

    int retries = 10; // Max 10 próbálkozás
    while (retries > 0)
    {
        try
        {
            logger.LogInformation("Próbálkozás az adatbázis elérésére...");
            context.Database.Migrate(); // Itt fogja létrehozni a FitnessDb-t és a Workouts táblát is!
            logger.LogInformation("Siker! Az adatbázis készen áll.");
            break; // Ha sikerült, kilépünk a ciklusból
        }
        catch (Exception ex)
        {
            retries--;
            logger.LogWarning($"Az SQL Server még nem áll készen. Újrapróbálkozás ({10 - retries}/10)...");
            System.Threading.Thread.Sleep(5000); // Várjunk 5 másodpercet a következő próbáig
            
            if (retries == 0)
            {
                logger.LogCritical(ex, "Nem sikerült csatlakozni az adatbázishoz.");
                throw;
            }
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();

app.UseCors("ReactPolicy"); // CORS bekapcsolása

app.Run();