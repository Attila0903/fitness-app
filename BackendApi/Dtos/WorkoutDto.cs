public class WorkoutDto
{
    public int Id {get;set;}
    public DateOnly Date {get;set;}    
    public string? Name {get;set;}
    public List<ExerciseDto> Exercises {get;set;} = [];
}