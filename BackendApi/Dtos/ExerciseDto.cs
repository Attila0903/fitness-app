using System.ComponentModel.DataAnnotations;

public class ExerciseDto
{
    public int Id { get; set; }
    [Required]
    public string? Name { get; set; }
    [Required]
    [MinLength(1, ErrorMessage = "Legalább egy sorozat kell")]
    public List<SetDto> Sets { get; set; } = new();
}