using Microsoft.EntityFrameworkCore;
public class FitnessDbContext : DbContext
{
    public FitnessDbContext(DbContextOptions<FitnessDbContext> options) : base(options) { }
    
    // Ez hozza létre a "Workouts" táblát
    public DbSet<Workout> Workouts { get; set; } 
}