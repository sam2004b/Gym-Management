using gymbackend.Data;
using gymbackend.DTOs;
using gymbackend.Models;
using Microsoft.EntityFrameworkCore;

namespace gymbackend.Services
{
    public class WorkoutService : IWorkoutService
    {
        private readonly ApplicationDbContext _context;

        public WorkoutService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> CreateWorkout(Guid trainerId, CreateWorkoutDto dto)
        {
            var workout = new WorkoutPlan
            {
                TrainerId = trainerId,
                Title = dto.Title,
                Description = dto.Description,
                DurationInWeeks = dto.DurationInWeeks,
                IsActive = true
            };

            _context.WorkoutPlans.Add(workout);
            await _context.SaveChangesAsync();

            foreach (var ex in dto.Exercises)
            {
                _context.WorkoutExercises.Add(new WorkoutExercise
                {
                    WorkoutPlanId = workout.Id,
                    ExerciseName = ex.ExerciseName,
                    Sets = ex.Sets,
                    Reps = ex.Reps,
                    Day = ex.Day
                });
            }

            await _context.SaveChangesAsync();

            return workout.Id;
        }

        public async Task AssignWorkout(Guid trainerId, AssignWorkoutDto dto)
        {
            var member = await _context.Users
                .FirstOrDefaultAsync(x => x.Id == dto.MemberId && x.SelectedTrainerId == trainerId);

            if (member == null)
                throw new Exception("Trainer not assigned to this member");

            var workoutPlan = await _context.WorkoutPlans
                .Include(x => x.Exercises)
                .FirstOrDefaultAsync(x => x.Id == dto.WorkoutPlanId && x.IsActive);

            if (workoutPlan == null)
                throw new Exception("Workout plan not found");

            // Create assignment
            _context.WorkoutAssignments.Add(new WorkoutAssignment
            {
                WorkoutPlanId = dto.WorkoutPlanId,
                MemberId = dto.MemberId,
                TrainerId = trainerId,
                AssignedAt = DateTime.UtcNow,
                IsActive = true
            });

            // Start generating sessions
            var startDate = DateTime.UtcNow.Date;

            foreach (var exercise in workoutPlan.Exercises)
            {
                var dayOfWeek = Enum.Parse<DayOfWeek>(exercise.Day);

                for (int week = 0; week < workoutPlan.DurationInWeeks; week++)
                {
                    var sessionDate = GetNextDateForDay(startDate.AddDays(week * 7), dayOfWeek);

                    var startTime = sessionDate.AddHours(10); // default 10 AM
                    var endTime = startTime.AddHours(1); // 1 hour session

                    _context.WorkoutSessions.Add(new WorkoutSession
                    {
                        Id = Guid.NewGuid(),
                        MemberId = dto.MemberId,
                        WorkoutPlanId = workoutPlan.Id,
                        SessionDate = sessionDate,
                        StartTime = startTime,
                        EndTime = endTime,
                        IsCompleted = false
                    });
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task<WorkoutResponseDto?> GetMemberWorkout(Guid memberId)
        {
            var assignment = await _context.WorkoutAssignments
                .Where(x => x.MemberId == memberId && x.IsActive)
                .OrderByDescending(x => x.AssignedAt)
                .FirstOrDefaultAsync();

            if (assignment == null)
                return null;

            var workout = await _context.WorkoutPlans
                .Where(x => x.Id == assignment.WorkoutPlanId && x.IsActive)
                .Select(x => new WorkoutResponseDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    Description = x.Description,
                    DurationInWeeks = x.DurationInWeeks,
                    Exercises = x.Exercises.Select(e => new WorkoutExerciseDto
                    {
                        ExerciseName = e.ExerciseName,
                        Sets = e.Sets,
                        Reps = e.Reps,
                        Day = e.Day
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            return workout;
        }

        public async Task<List<WorkoutResponseDto>> GetTrainerWorkouts(Guid trainerId)
        {
            return await _context.WorkoutPlans
                .Where(x => x.TrainerId == trainerId && x.IsActive)
                .Select(x => new WorkoutResponseDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    Description = x.Description,
                    DurationInWeeks = x.DurationInWeeks,
                    Exercises = x.Exercises.Select(e => new WorkoutExerciseDto
                    {
                        ExerciseName = e.ExerciseName,
                        Sets = e.Sets,
                        Reps = e.Reps,
                        Day = e.Day
                    }).ToList()
                })
                .ToListAsync();
        }

        public async Task UpdateWorkout(Guid trainerId, Guid workoutId, UpdateWorkoutDto dto)
        {
            var workout = await _context.WorkoutPlans
                .FirstOrDefaultAsync(x => x.Id == workoutId && x.TrainerId == trainerId && x.IsActive);

            if (workout == null)
                throw new Exception("Workout not found");

            workout.Title = dto.Title;
            workout.Description = dto.Description;
            workout.DurationInWeeks = dto.DurationInWeeks;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteWorkout(Guid trainerId, Guid workoutId)
        {
            var workout = await _context.WorkoutPlans
                .FirstOrDefaultAsync(x => x.Id == workoutId && x.TrainerId == trainerId && x.IsActive);

            if (workout == null)
                throw new Exception("Workout not found");

            workout.IsActive = false;

            await _context.SaveChangesAsync();
        }

        private DateTime GetNextDateForDay(DateTime startDate, DayOfWeek targetDay)
        {
            int daysToAdd = ((int)targetDay - (int)startDate.DayOfWeek + 7) % 7;
            return startDate.AddDays(daysToAdd);
        }
    }
}