using System.ComponentModel.DataAnnotations;

public class SetDto
{
    public int Id { get; set; }
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Ismétlések száma legalább 1 kell legyen")]
    public int Reps { get; set; }
    [Required]
    [Range(0, int.MaxValue, ErrorMessage = "Súly nem lehet negatív")]
    public int Weight { get; set; }
}