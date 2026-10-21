using gymbackend.Data;
using gymbackend.DTOs;
using gymbackend.Models;
using Microsoft.EntityFrameworkCore;

namespace gymbackend.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly ApplicationDbContext _context;

        public AttendanceService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CheckIn(Guid memberId)
        {
            var today = DateTime.UtcNow.Date;

            var alreadyChecked = await _context.Attendances
                .AnyAsync(a => a.MemberId == memberId && a.CheckInTime.Date == today);

            if (alreadyChecked)
                throw new Exception("Attendance already marked today.");

            var attendance = new Attendance
            {
                Id = Guid.NewGuid(),
                MemberId = memberId,
                CheckInTime = DateTime.UtcNow
            };

            _context.Attendances.Add(attendance);

            await _context.SaveChangesAsync();
        }

        public async Task<List<AttendanceResponseDto>> GetMyAttendance(Guid memberId)
        {
            return await _context.Attendances
                .Where(a => a.MemberId == memberId)
                .OrderByDescending(a => a.CheckInTime)
                .Select(a => new AttendanceResponseDto
                {
                    Id = a.Id,
                    CheckInTime = a.CheckInTime
                })
                .ToListAsync();
        }

        public async Task<List<AttendanceResponseDto>> GetMemberAttendance(Guid memberId)
        {
            return await _context.Attendances
                .Where(a => a.MemberId == memberId)
                .OrderByDescending(a => a.CheckInTime)
                .Select(a => new AttendanceResponseDto
                {
                    Id = a.Id,
                    CheckInTime = a.CheckInTime
                })
                .ToListAsync();
        }
    }
}