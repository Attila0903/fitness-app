using Microsoft.AspNetCore.Mvc;

public interface IWorkoutRepository
{
    public Task<IEnumerable<Workout>> GetWorkouts();
    public Task<Workout> AddWorkout(Workout workout);
    public Task<Workout?> DeleteWorkout(Workout workoutId);
    public Task<Workout?> GetWorkoutById(int workoutId);
    public Task<Workout?> GetWorkoutByDate(DateOnly date);
}