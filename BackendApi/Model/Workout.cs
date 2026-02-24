using System.ComponentModel.DataAnnotations;

public class Workout
{
    [Key]
    public int Id {get;set;}
    public DateTime Date {get;set;}    
    public string? Name {get;set;}
    public List<Exercise> Exercises {get;set;} = [];
}