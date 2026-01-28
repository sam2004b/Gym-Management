using gymbackend.DTOs;
using gymbackend.Models;

namespace gymbackend.Services
{
    public interface IAuthService
    {
        Task<string> Register(RegisterDto dto);
        Task<string> Login(LoginDto dto);
        Task<User> GetProfile(Guid userId);
        Task UpdateProfile(Guid userId, UpdateProfileDto dto);
        Task ApproveTrainer(Guid trainerId);
        Task<List<TrainerListDto>> GetApprovedTrainers();
    }
}
