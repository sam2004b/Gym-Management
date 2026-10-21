using gymbackend.Data;
using gymbackend.DTOs;
using gymbackend.Models;
using Microsoft.EntityFrameworkCore;

public class FeedbackService : IFeedbackService
{
    private readonly ApplicationDbContext _context;

    public FeedbackService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task CreateFeedback(Guid userId, CreateFeedbackDto dto)
    {
        var feedback = new Feedback
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ClassId = dto.ClassId,
            Rating = dto.Rating,
            Message = dto.Message,
            CreatedAt = DateTime.UtcNow
        };

        _context.Feedbacks.Add(feedback);
        await _context.SaveChangesAsync();
    }

    
    public async Task<List<object>> GetMyFeedback(Guid userId)
    {
        return await (
            from f in _context.Feedbacks
            join c in _context.ClassSchedules on f.ClassId equals c.Id
            join t in _context.Users on c.TrainerId equals t.Id
            where f.UserId == userId
            select new
            {
                f.Id,
                className = c.ClassName,  
                trainerName = t.FullName,
                f.Rating,
                f.Message,
                f.CreatedAt
            }
        ).ToListAsync<object>();
    }


    public async Task<List<object>> GetAllFeedback()
    {
        return await (
            from f in _context.Feedbacks
            join c in _context.ClassSchedules on f.ClassId equals c.Id
            join u in _context.Users on f.UserId equals u.Id
            join t in _context.Users on c.TrainerId equals t.Id
            select new
            {
                f.Id,
                userName = u.FullName,
                className = c.ClassName,   
                trainerName = t.FullName,
                f.Rating,
                f.Message,
                f.CreatedAt
            }
        ).ToListAsync<object>();
    }


    public async Task<List<object>> GetTrainerFeedback(Guid trainerId)
    {
        return await (
            from f in _context.Feedbacks
            join c in _context.ClassSchedules on f.ClassId equals c.Id
            where c.TrainerId == trainerId
            select new
            {
                f.Id,
                className = c.ClassName,   
                f.Rating,
                f.Message,
                f.CreatedAt
            }
        ).ToListAsync<object>();
    }
}