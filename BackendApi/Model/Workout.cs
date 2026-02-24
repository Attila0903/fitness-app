using System.ComponentModel.DataAnnotations;

public class Workout
{
    [Key]
    public int Id {get;set;}
    public DateOnly Date {get;set;}    
    public string? Name {get;set;}
    public List<Exercise> Exercises {get;set;} = [];
}