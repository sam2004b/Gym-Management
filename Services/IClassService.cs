using gymbackend.DTOs;
using gymbackend.Models;

namespace gymbackend.Services
{
    public interface IClassService
    {
        Task CreateClass(Guid userId, CreateClassDto dto);

        Task DeleteClass(Guid userId, Guid classId);

        Task<List<object>> GetAvailableClasses();

        Task BookClass(Guid memberId, BookClassDto dto);

        Task<List<ClassSchedule>> GetTrainerClasses(Guid trainerId);

        Task<List<object>> GetMemberBookedClasses(Guid memberId);
    }
}