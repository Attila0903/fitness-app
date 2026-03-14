using System.ComponentModel.DataAnnotations;

public class WorkoutDto
{
    public int Id {get;set;}
    [Required]
    public DateOnly Date {get;set;}
    [Required]
    public string? Name {get;set;}
    public double TotalVolume{get;set;}
    [Required]
    [MinLength(1, ErrorMessage = "Legal�bb egy gyakorlat kell")]
    public List<ExerciseDto>? Exercises {get;set;}
}