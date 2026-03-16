using gymbackend.Data;
using gymbackend.DTOs;
using gymbackend.Models;
using Microsoft.EntityFrameworkCore;

namespace gymbackend.Services
{
    public class ClassService : IClassService
    {
        private readonly ApplicationDbContext _context;

        public ClassService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateClass(Guid trainerId, CreateClassDto dto)
        {
            var classSchedule = new ClassSchedule
            {
                Id = Guid.NewGuid(),
                TrainerId = trainerId,
                ClassName = dto.ClassName,
                Day = dto.Day,
                Time = dto.Time,
                Capacity = dto.Capacity
            };

            _context.ClassSchedules.Add(classSchedule);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteClass(Guid trainerId, Guid classId)
        {
            var classSchedule = await _context.ClassSchedules
                .FirstOrDefaultAsync(x => x.Id == classId && x.TrainerId == trainerId);

            if (classSchedule == null)
                throw new Exception("Class not found");

            classSchedule.IsActive = false;

            await _context.SaveChangesAsync();
        }
        public async Task<List<ClassSchedule>> GetTrainerClasses(Guid trainerId)
        {
                return await _context.ClassSchedules
                .Where(x => x.TrainerId == trainerId && x.IsActive)
                .ToListAsync();
         }
        public async Task<List<ClassSchedule>> GetAvailableClasses()
        {
            return await _context.ClassSchedules
                .Where(x => x.IsActive)
                .ToListAsync();
        }
        
        public async Task BookClass(Guid memberId, BookClassDto dto)
        {
            var classSchedule = await _context.ClassSchedules
                .FirstOrDefaultAsync(x => x.Id == dto.ClassId && x.IsActive);

            if (classSchedule == null)
                throw new Exception("Class not found");

            var bookingsCount = await _context.ClassBookings
                .CountAsync(x => x.ClassId == dto.ClassId);

            if (bookingsCount >= classSchedule.Capacity)
                throw new Exception("Class is full");

            var booking = new ClassBooking
            {
                Id = Guid.NewGuid(),
                MemberId = memberId,
                ClassId = dto.ClassId
            };

            _context.ClassBookings.Add(booking);

            await _context.SaveChangesAsync();
        }
    }
}