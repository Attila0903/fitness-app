using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class WorkoutsController : ControllerBase
{
    private readonly FitnessDbContext _context;

    public WorkoutsController(FitnessDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Workout>>> GetWorkouts()
    {
        var workouts = await _context.Workouts.Include(w => w.Exercises).ThenInclude(e => e.Sets).Select(
            w => new WorkoutDto
            {
                Id = w.Id,
                Date = w.Date,
                Name = w.Name,
                Exercises = w.Exercises.Select(e => new ExerciseDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Sets = e.Sets.Select(s => new SetDto
                    {
                        Id = s.Id,
                        Reps = s.Reps,
                        Weight = s.Weight
                    }).ToList()
                }).ToList()
            }
        ).ToListAsync();

        return Ok(workouts);
    }

    [HttpPost]
    public async Task<ActionResult<Workout>> AddWorkout(WorkoutDto workoutDto)
    {
        var workout = new Workout
        {
            Date = workoutDto.Date,
            Name = workoutDto.Name,
            Exercises = workoutDto.Exercises.Select(e => new Exercise
            {
                Name = e.Name,
                Sets = e.Sets.Select(s => new Set
                {
                    Reps = s.Reps,
                    Weight= s.Weight
                }).ToList()
            }).ToList()
        };      
        _context.Workouts.Add(workout);
        //ID legenerálódik
        await _context.SaveChangesAsync();
        //Dto-nak beállítjuk az Id-t
        workoutDto.Id = workout.Id;
        //Visszaküldjük a Dto-t
        return Ok(workoutDto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWorkout([FromRoute] int id)
    {
        var deletedWorkout = await _context.Workouts.Include(w => w.Exercises).ThenInclude(e => e.Sets).Where(w => w.Id == id).FirstOrDefaultAsync();

        if (deletedWorkout == null)
        {
            return NotFound();
        }

        _context.Workouts.Remove(deletedWorkout);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}