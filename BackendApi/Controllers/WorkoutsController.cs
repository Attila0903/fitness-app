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
        var workouts = await _context.Workouts.Include(w => w.Exercises).ThenInclude(e => e.Sets).ToListAsync();
        return Ok(workouts);        
    }

    [HttpPost]
    public ActionResult<Workout> AddWorkout(Workout workout)
    {
        _context.Workouts.Add(workout);
        _context.SaveChanges();
        return Ok(workout);
    }

    [HttpDelete("{id}")]
     public async Task<IActionResult> DeleteWorkout([FromRoute]int id)
    {        
        var deletedWorkout = await _context.Workouts.Include(w => w.Exercises).ThenInclude(e => e.Sets).FirstOrDefaultAsync();

        if(deletedWorkout == null)
        {
            return NotFound();
        }

        _context.Workouts.Remove(deletedWorkout);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}