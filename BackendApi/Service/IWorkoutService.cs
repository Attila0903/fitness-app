public interface IWorkoutService
{
    public Task<IEnumerable<WorkoutDto>> GetWorkouts();
    public Task<WorkoutDto> AddWorkout(WorkoutDto dto);
    public Task<WorkoutDto?> DeleteWorkout(int id);
    public Task<WorkoutDto?> GetWorkoutById(int id);
}
