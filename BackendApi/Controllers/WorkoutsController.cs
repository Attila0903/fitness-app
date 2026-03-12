using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class WorkoutsController : ControllerBase
{
    private readonly IWorkoutService service;

    public WorkoutsController(IWorkoutService serv)
    {
        service = serv;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WorkoutDto>>> GetWorkouts()
    {
        var workoutDtos = await service.GetWorkouts();
        
        return Ok(workoutDtos);           
    }

    [HttpPost]
    public async Task<ActionResult<WorkoutDto>> AddWorkout(WorkoutDto dto)
    {
        try
        {
            var addedWorkout = await service.AddWorkout(dto);
            return CreatedAtAction(nameof(GetWorkoutById), new { id = addedWorkout.Id }, addedWorkout);
        }
        catch (DbUpdateException e)
        {
            return StatusCode(500, "Váratlan hiba történt a mentés során.");
        }
        catch (Exception e) { 
            return Conflict(e.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWorkout([FromRoute] int id)
    {
        try{
            var deletedWorkout = await service.DeleteWorkout(id);
            if (deletedWorkout == null) return NotFound();
            return NoContent();
        }catch(DbUpdateException e)
        {   
            return Conflict(e.Message);
        }        
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkoutDto>> GetWorkoutById(int id)
    {
        var workout = await service.GetWorkoutById(id);

        if (workout == null)
        {
            return NotFound();
        }

        return Ok(workout);
    }
}