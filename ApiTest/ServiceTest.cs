using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ApiTest
{
    public class ServiceTest
    {
        [Fact]
        public async Task GetWorkoutsTest()
        {
            var mockRepository = new MockWorkoutRepository();
            var service = new WorkoutService(mockRepository);            


            var result = await service.GetWorkouts();           

            var firsWorkout = result.First();
            var secondWorkout = result.ElementAt(1);

            Assert.Equal("Hát", firsWorkout.Name);
            Assert.Equal("Evezés", firsWorkout.Exercises?.First().Name);

            Assert.Equal(2, secondWorkout.Id);
            Assert.Equal("Guggolás", secondWorkout.Exercises?.First().Name);

            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task DeleteWorkoutTest() {
            var mockRepository = new MockWorkoutRepository();
            var service = new WorkoutService(mockRepository);            

            var result = await service.DeleteWorkout(1);
            var result2 = await service.DeleteWorkout(1);
            
            Assert.Null(result2);

            var getResult = await service.GetWorkouts();            

            Assert.Single(getResult);
            Assert.Equal(2, getResult.First().Id); // Csak a 2-es maradt meg
        }

        [Fact]
        public async Task AddWorkoutTest() {
            var mockRepository = new MockWorkoutRepository();
            var service = new WorkoutService(mockRepository);

            var newWorkout = new WorkoutDto
            {                
                Date = new DateOnly(2026, 3, 12),
                Name = "Mell",
                Exercises = new List<ExerciseDto>
                {
                    new ExerciseDto
                    {                        
                        Name = "Fekvenyomás",
                        Sets = new List<SetDto>
                        {
                            new SetDto { Reps = 8, Weight = 70 }
                        }
                    }
                }
            };

            var result = await service.AddWorkout(newWorkout);
            Assert.Equal(3, result.Id);

            var newWorkout1 = new WorkoutDto
            {               
                Date = new DateOnly(2026, 3, 12),
                Name = "Mell",
                Exercises = new List<ExerciseDto>
                {
                    new ExerciseDto
                    {                        
                        Name = "Fekvenyomás",
                        Sets = new List<SetDto>
                        {
                            new SetDto { Reps = 8, Weight = 70 }
                        }
                    }
                }
            };

            await Assert.ThrowsAsync<Exception>(()=>service.AddWorkout(newWorkout1));
        }

        
    }
}