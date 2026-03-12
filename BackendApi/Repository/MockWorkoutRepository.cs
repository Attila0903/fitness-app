
using System.Reflection.Metadata.Ecma335;
using Microsoft.EntityFrameworkCore;

public class MockWorkoutRepository : IWorkoutRepository
{
    private readonly List<Workout> workouts;
    private int currentWorkoutId;
    private int currentExerciseId;
    private int currentSetId;

    public MockWorkoutRepository()
    {
        workouts =
        [
            new Workout
            {
                Id = 1,
                Date = new DateOnly(2026, 3, 10),
                Name = "Hát",
                Exercises = new List<Exercise>
                        {
                            new Exercise{Id = 1, Name = "Evezés",
                                         Sets = new List<Set>
                                         {
                                            new Set{Id = 1, Reps = 8, Weight = 60}
                                         }
                            }
                        }
            },
            new Workout
            {
                Id = 2,
                Date = new DateOnly(2026, 3, 11),
                Name = "Láb",
                Exercises = new List<Exercise>
                        {
                            new Exercise{Id = 2, Name = "Guggolás",
                                         Sets = new List<Set>
                                         {
                                            new Set{Id = 2, Reps = 8, Weight = 80}
                                         }
                            }
                        }
            }
            ,
        ];
        currentWorkoutId = 3;
        currentExerciseId = 3;
        currentSetId = 3;
    }

    public async Task<Workout?> GetWorkoutById(int workoutId)
    {
        return workouts.FirstOrDefault(w => w.Id == workoutId);
    }

    public async Task<Workout> AddWorkout(Workout workout)
    {
        workout.Id = currentWorkoutId;
        currentWorkoutId++;
        foreach (var e in workout.Exercises) { 
            e.Id = currentExerciseId;
            currentExerciseId++;
            foreach (var s in e.Sets) { 
                s.Id = currentSetId;
                currentSetId++;
            }
        }
        workouts.Add(workout);
        return workout;
    }

    public async Task<Workout?> DeleteWorkout(Workout workout)
    {        
        workouts.Remove(workout); 
        return workout;
    }

    public async Task<IEnumerable<Workout>> GetWorkouts()
    {
        return workouts.ToList();
    }

    public async Task<Workout?> GetWorkoutByDate(DateOnly date)
    {
        return workouts.FirstOrDefault(w => w.Date == date);
    }
}