using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

[Route("api/[controller]")]
[ApiController]
public class WorkoutController : ControllerBase
{
    private readonly FitnessDbContext _context;

    public WorkoutController (FitnessDbContext context)
    {
        _context = context;
    } 

    [HttpGet]
    public IEnumerable<Workout> GetWorkouts()
    {        
        return _context.Workouts.ToList();        
    }

    [HttpPost]
    public ActionResult<Workout> AddWorkout(Workout workout)
    {
        _context.Workouts.Add(workout);
        _context.SaveChanges();
        return Ok(workout);
    }
}