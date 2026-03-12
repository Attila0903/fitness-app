namespace BackendApi.Mapper;
public static class WorkoutConvertExtensions
{
    public static Workout ToWorkout(this WorkoutDto dto)
    {       
        return new Workout
        {
            Name = dto.Name,
            Date = dto.Date,
            Exercises = dto.Exercises.Select(e => new Exercise
            {
                Name = e.Name,
                Sets = e.Sets.Select(s => new Set
                {
                    Weight = s.Weight,
                    Reps = s.Reps
                }
                ).ToList()
            }
            ).ToList()
        };
    }

    public static WorkoutDto ToDto(this Workout workout)
    {       
        return new WorkoutDto
        {
            Id = workout.Id,
            Name = workout.Name,
            Date = workout.Date,
            Exercises = workout.Exercises.Select(e => new ExerciseDto
            {
                Id = e.Id,
                Name = e.Name,
                Sets = e.Sets.Select(s => new SetDto
                {
                    Id = s.Id,
                    Weight = s.Weight,
                    Reps = s.Reps
                }
                ).ToList()
            }
            ).ToList()
        };
    }
}