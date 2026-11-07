public class CreateFeedbackDto
{
    public Guid ClassId { get; set; }
    public int Rating { get; set; }
    public string Message { get; set; }
}