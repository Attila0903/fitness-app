using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.Identity.Client;

public class Exercise
{
    [Key]
    public int Id{get;set;}
    public string? Name{get;set;}  
    public List<Set>? Sets{get;set;}  
}