using gymbackend.DTOs;
using gymbackend.Models;

namespace gymbackend.Services
{
    public interface IClassService
    {
        Task CreateClass(Guid trainerId, CreateClassDto dto);

        Task DeleteClass(Guid trainerId, Guid classId);

        Task<List<ClassSchedule>> GetAvailableClasses();

        Task BookClass(Guid memberId, BookClassDto dto);
        Task<List<ClassSchedule>> GetTrainerClasses(Guid trainerId);
    }
}