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
        var workoutWithSameDate = await repository.GetWorkoutByDate(dto.Date);
        if (workoutWithSameDate != null)
        {
            throw new Exception($"Már létezik edzés a megadott dátummal: {dto.Date}");
        }

        var addedWorkout = await repository.AddWorkout(dto.ToWorkout());
        //Itt ha a dto ki lenne bővítve más tulajdonságokkal, a paraméterben
        //lévő dto-val kellene kibővíteni a visszakapott Workout tulajdonságait
        return addedWorkout.ToDto();
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