using gymbackend.DTOs;

namespace gymbackend.Services
{
    public interface IAttendanceService
    {
        Task CheckIn(Guid memberId);
        Task<List<AttendanceResponseDto>> GetMyAttendance(Guid memberId);
        Task<List<AttendanceResponseDto>> GetMemberAttendance(Guid memberId);
    }
}