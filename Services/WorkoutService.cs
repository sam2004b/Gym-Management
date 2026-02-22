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

            _context.WorkoutAssignments.Add(new WorkoutAssignment
            {
                WorkoutPlanId = dto.WorkoutPlanId,
                MemberId = dto.MemberId,
                TrainerId = trainerId,
                AssignedAt = DateTime.UtcNow,
                IsActive = true
            });

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
    }
}