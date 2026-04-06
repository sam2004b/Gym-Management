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

        // ✅ CREATE CLASS (ADMIN SELECTS TRAINER + DESCRIPTION)
        public async Task CreateClass(Guid userId, CreateClassDto dto)
        {
            var classSchedule = new ClassSchedule
            {
                Id = Guid.NewGuid(),
                TrainerId = dto.TrainerId, // ✅ FIXED
                ClassName = dto.ClassName,
                Day = dto.Day,
                Time = dto.Time,
                Capacity = dto.Capacity,
                Description = dto.Description,
                IsActive = true
            };

            _context.ClassSchedules.Add(classSchedule);
            await _context.SaveChangesAsync();
        }

        // ✅ DELETE CLASS (SOFT DELETE)
        public async Task DeleteClass(Guid userId, Guid classId)
        {
            var classSchedule = await _context.ClassSchedules
                .FirstOrDefaultAsync(x => x.Id == classId);

            if (classSchedule == null)
                throw new Exception("Class not found");

            classSchedule.IsActive = false;

            await _context.SaveChangesAsync();
        }

        // ✅ TRAINER CLASSES
        public async Task<List<ClassSchedule>> GetTrainerClasses(Guid trainerId)
        {
            return await _context.ClassSchedules
                .Where(x => x.TrainerId == trainerId && x.IsActive)
                .ToListAsync();
        }

        // ✅ REAL-TIME CLASS DATA (BOOKING COUNT + TRAINER NAME)
        public async Task<List<object>> GetAvailableClasses()
        {
            var classes = await (
                from c in _context.ClassSchedules
                where c.IsActive

                join u in _context.Users on c.TrainerId equals u.Id

                select new
                {
                    id = c.Id,
                    className = c.ClassName,
                    day = c.Day,
                    time = c.Time,
                    capacity = c.Capacity,

                    // ✅ NEW
                    description = c.Description,

                    // ✅ TRAINER NAME
                    trainerName = u.FullName,

                    // ✅ REAL-TIME BOOKING COUNT
                    bookedCount = _context.ClassBookings
                        .Count(b => b.ClassId == c.Id)
                }
            ).ToListAsync();

            return classes.Cast<object>().ToList();
        }

        // ✅ MEMBER BOOKED CLASSES
        public async Task<List<object>> GetMemberBookedClasses(Guid memberId)
        {
            return await (
                from cb in _context.ClassBookings
                join c in _context.ClassSchedules on cb.ClassId equals c.Id
                join u in _context.Users on c.TrainerId equals u.Id
                where cb.MemberId == memberId
                select new
                {
                    id = c.Id,
                    name = c.ClassName,
                    trainer = u.FullName,
                    time = c.Time
                }
            ).ToListAsync<object>();
        }

        // ✅ BOOK CLASS (AUTO UPDATES COUNT)
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