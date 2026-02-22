using gymbackend.DTOs;

namespace gymbackend.Services
{
    public interface IWorkoutService
    {
        Task<Guid> CreateWorkout(Guid trainerId, CreateWorkoutDto dto);
        Task AssignWorkout(Guid trainerId, AssignWorkoutDto dto);
        Task<WorkoutResponseDto> GetMemberWorkout(Guid memberId);
        Task<List<WorkoutResponseDto>> GetTrainerWorkouts(Guid trainerId);
        Task UpdateWorkout(Guid trainerId, Guid workoutId, UpdateWorkoutDto dto);
        Task DeleteWorkout(Guid trainerId, Guid workoutId);
    }
}