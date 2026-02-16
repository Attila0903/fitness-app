using System.ComponentModel.DataAnnotations;

public class Set
{
    [Key]
    public int Id{get;set;}
    [Range(1,1000)]
    public int Weight{get;set;}
    [Range(1,1000)]
    public int Reps{get;set;}
}