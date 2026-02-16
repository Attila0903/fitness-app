
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Data;
public class FitnessDbContext: DbContext
{
    public FitnessDbContext (DbContextOptions<FitnessDbContext> options) : base (options){}

    public DbSet<Workout> Workouts{get;set;}
}