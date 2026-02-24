using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;

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
    public async Task<ActionResult<IEnumerable<Workout>>> GetWorkouts()
    {        
        return Ok(_context.Workouts.Include(w => w.Exercises).ThenInclude(e => e.Sets).ToListAsync());        
    }

    [HttpPost]
    public ActionResult<Workout> AddWorkout(Workout workout)
    {
        _context.Workouts.Add(workout);
        _context.SaveChanges();
        return Ok(workout);
    }
}