using gymbackend.Data;
using gymbackend.DTOs;
using gymbackend.Models;
using Microsoft.EntityFrameworkCore;

namespace gymbackend.Services
{
    public class ClassService : IClassService
    {
        private readonly ApplicationDbContext _context;
        private readonly NotificationService _notificationService;
         public ClassService(
            ApplicationDbContext context,
            NotificationService notificationService)
        {
           _context = context;
           _notificationService = notificationService;
         }

        public async Task CreateClass(Guid userId, CreateClassDto dto)
        {
            var classSchedule = new ClassSchedule
            {
                Id = Guid.NewGuid(),
                TrainerId = userId,
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

        public async Task DeleteClass(Guid userId, Guid classId)
        {
            var classSchedule = await _context.ClassSchedules
                .FirstOrDefaultAsync(x => x.Id == classId);

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
                    description = c.Description,
                    trainerName = u.FullName,
                    bookedCount = _context.ClassBookings
                        .Count(b => b.ClassId == c.Id)
                }
            ).ToListAsync();

            return classes.Cast<object>().ToList();
        }

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

            var exists = await _context.ClassBookings
                .AnyAsync(x => x.MemberId == memberId && x.ClassId == dto.ClassId);

            if (exists)
                throw new Exception("Already booked");

            var booking = new ClassBooking
            {
                Id = Guid.NewGuid(),
                MemberId = memberId,
                ClassId = dto.ClassId
            };
    
            _context.ClassBookings.Add(booking);

             await _context.SaveChangesAsync();

           await _notificationService.CreateNotification(
            memberId,
            "Class Booked",
             $"You successfully booked {classSchedule.ClassName}.",
             "class"
             );
        }

        public async Task CancelBooking(Guid memberId, Guid classId)
        {
            var booking = await _context.ClassBookings
                .FirstOrDefaultAsync(x => x.MemberId == memberId && x.ClassId == classId);

            if (booking == null)
                throw new Exception("Booking not found");

            _context.ClassBookings.Remove(booking);
            await _context.SaveChangesAsync();
        }

        public async Task<List<object>> GetTrainerMembers(Guid trainerId)
        {
            var classIds = await _context.ClassSchedules
                .Where(c => c.TrainerId == trainerId && c.IsActive)
                .Select(c => c.Id)
                .ToListAsync();

            var classMemberIds = await _context.ClassBookings
                .Where(cb => classIds.Contains(cb.ClassId))
                .Select(cb => cb.MemberId)
                .ToListAsync();

            var workoutMemberIds = await _context.WorkoutAssignments
                .Where(wa => wa.TrainerId == trainerId && wa.IsActive)
                .Select(wa => wa.MemberId)
                .ToListAsync();

            var allMemberIds = classMemberIds
                .Concat(workoutMemberIds)
                .Distinct()
                .ToList();

            var members = await (
                from u in _context.Users
                where allMemberIds.Contains(u.Id)

                join m in _context.Memberships
                    on u.Id equals m.UserId into membershipGroup
                from membership in membershipGroup.DefaultIfEmpty()

                select new
                {
                    id = u.Id,
                    name = u.FullName,
                    email = u.Email,
                    phone = u.PhoneNumber,
                    membershipType = membership != null ? membership.SubscriptionType : "N/A",
                    expiryDate = membership != null ? membership.ExpiryDate : (DateTime?)null,
                    isActive = membership != null && membership.ExpiryDate > DateTime.UtcNow
                }
            ).ToListAsync();

            return members.Cast<object>().ToList();
        }
    }
}