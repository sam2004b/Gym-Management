using gymbackend.DTOs;
using gymbackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace gymbackend.Controllers
{
    [ApiController]
    [Route("api/workout")]
    public class WorkoutController : ControllerBase
    {
        private readonly IWorkoutService _service;

        public WorkoutController(IWorkoutService service)
        {
            _service = service;
        }

        [Authorize(Roles = "trainer")]
        [HttpPost("create")]
        public async Task<IActionResult> Create(CreateWorkoutDto dto)
        {
            var trainerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var id = await _service.CreateWorkout(trainerId, dto);
            return Ok(new { workoutId = id });
        }

        [Authorize(Roles = "trainer")]
        [HttpPost("assign")]
        public async Task<IActionResult> Assign(AssignWorkoutDto dto)
        {
            var trainerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            await _service.AssignWorkout(trainerId, dto);
            return Ok("Workout assigned successfully");
        }

        [Authorize(Roles = "trainer")]
        [HttpGet("my-workouts")]
        public async Task<IActionResult> GetMyWorkouts()
        {
            var trainerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var workouts = await _service.GetTrainerWorkouts(trainerId);
            return Ok(workouts);
        }

        [Authorize(Roles = "member")]
        [HttpGet("my-workout")]
        public async Task<IActionResult> GetMemberWorkout()
        {
            var memberId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var workout = await _service.GetMemberWorkout(memberId);
            return Ok(workout);
        }

        [Authorize(Roles = "trainer")]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateWorkoutDto dto)
        {
            var trainerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            await _service.UpdateWorkout(trainerId, id, dto);
            return Ok("Workout updated");
        }

        [Authorize(Roles = "trainer")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var trainerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            await _service.DeleteWorkout(trainerId, id);
            return Ok("Workout deleted");
        }
    }
}