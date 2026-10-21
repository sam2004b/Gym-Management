using gymbackend.Data;
using gymbackend.DTOs;
using gymbackend.Models;
using gymbackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace gymbackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WorkoutSessionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly NotificationService _notificationService;

        public WorkoutSessionController(
            ApplicationDbContext context,
            NotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateWorkoutSession(CreateWorkoutSessionDto dto)
        {
            var session = new WorkoutSession
            {
                Id = Guid.NewGuid(),
                MemberId = dto.MemberId,
                WorkoutPlanId = dto.WorkoutPlanId,
                SessionDate = dto.SessionDate,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                IsCompleted = false
            };

            _context.WorkoutSessions.Add(session);
            await _context.SaveChangesAsync();

            await _notificationService.CreateNotification(
                session.MemberId,
                "New Workout Scheduled 🏋️",
                "Your trainer scheduled a workout session.",
                "Workout"
            );

            return Ok(session);
        }

        [HttpGet("my-calendar")]
        public async Task<IActionResult> GetMyCalendar()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var sessions = await _context.WorkoutSessions
                .Include(x => x.WorkoutPlan)
                .Where(x => x.MemberId == userId)
                .Select(x => new
                {
                    id = x.Id,
                    title = x.WorkoutPlan.Title,
                    start = x.StartTime,
                    end = x.EndTime
                })
                .ToListAsync();

            return Ok(sessions);
        }

        [HttpGet("member/{memberId}")]
        public async Task<IActionResult> GetMemberSessions(Guid memberId)
        {
            var sessions = await _context.WorkoutSessions
                .Where(x => x.MemberId == memberId)
                .ToListAsync();

            return Ok(sessions);
        }

        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompleteWorkout(Guid id)
        {
            var session = await _context.WorkoutSessions.FindAsync(id);

            if (session == null)
                return NotFound();

            session.IsCompleted = true;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Workout marked as completed" });
        }

    
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSession(Guid id)
        {
            var session = await _context.WorkoutSessions.FindAsync(id);

            if (session == null)
                return NotFound();

            _context.WorkoutSessions.Remove(session);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Workout deleted" });
        }
    }
}