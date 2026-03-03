public class ExerciseDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public List<SetDto> Sets { get; set; } = new();
}