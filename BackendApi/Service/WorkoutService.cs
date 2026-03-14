using BackendApi.Mapper;

public class WorkoutService : IWorkoutService
{
    private readonly IWorkoutRepository repository;

    public WorkoutService(IWorkoutRepository repo)
    {
        repository = repo;
    }
    public async Task<WorkoutDto> AddWorkout(WorkoutDto dto)
    {   
        var addedWorkout = await repository.AddWorkout(dto.ToWorkout());
        var workoutDto = addedWorkout.ToDto();
        if(dto.Exercises != null)
        {
            workoutDto.TotalVolume = dto.Exercises
                .SelectMany(e => e.Sets == null ? new List<SetDto>() : e.Sets)
                .Sum(s => s.Weight * s.Reps);
        }

        return workoutDto;
    }

    public async Task<WorkoutDto?> DeleteWorkout(int id)
    {        
        var workoutToDelete = await repository.GetWorkoutById(id);
        if (workoutToDelete == null)
        {
            return null;
        }
        var deletedWorkout = await repository.DeleteWorkout(workoutToDelete);        
        var workoutDto = deletedWorkout?.ToDto();
        return workoutDto;
    }

    public async Task<IEnumerable<WorkoutDto>> GetWorkouts()
    {
        var workouts = await repository.GetWorkouts();
        var workoutDtos = workouts.Select(w => w.ToDto()); 
        return workoutDtos;
    }

    public async Task<WorkoutDto?> GetWorkoutById(int id)
    {
        var workout = await repository.GetWorkoutById(id);        
        return workout?.ToDto();
    }
}