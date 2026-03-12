using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendApi.Mapper;
using Microsoft.Identity.Client;

public class WorkoutRepository : IWorkoutRepository
{
    private readonly FitnessDbContext _context;

    public WorkoutRepository(FitnessDbContext fitnessDbContext)
    {
        _context = fitnessDbContext;
    }
    public async Task<Workout> AddWorkout(Workout workout)
    {
        _context.Workouts.Add(workout);
        await _context.SaveChangesAsync();
        return workout;
    }

    public async Task<Workout?> DeleteWorkout(Workout workout)
    {
        _context.Workouts.Remove(workout);
        await _context.SaveChangesAsync();

        return workout;
    }

    public async Task<IEnumerable<Workout>> GetWorkouts()
    {
        var workouts = await _context.Workouts.Include(w => w.Exercises).ThenInclude(e => e.Sets).ToListAsync();

        return workouts;
    }

    public async Task<Workout?> GetWorkoutById(int workoutId)
    {
        var workout = await _context.Workouts.Include(w => w.Exercises).ThenInclude(e => e.Sets).FirstOrDefaultAsync(w => w.Id == workoutId);
        return workout;
    }

    public async Task<Workout?> GetWorkoutByDate(DateOnly date)
    {
        return await _context.Workouts.Include(w => w.Exercises).ThenInclude(e => e.Sets).FirstOrDefaultAsync(w => w.Date == date);
    }
}