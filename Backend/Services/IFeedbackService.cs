using gymbackend.DTOs;

public interface IFeedbackService
{
    Task CreateFeedback(Guid userId, CreateFeedbackDto dto);
    Task<List<object>> GetMyFeedback(Guid userId);
    Task<List<object>> GetAllFeedback();
    Task<List<object>> GetTrainerFeedback(Guid trainerId);
}