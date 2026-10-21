namespace gymbackend.Models
{
    public class Feedback
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid ClassId { get; set; }

        public int Rating { get; set; }
        public string Message { get; set; }

        public DateTime CreatedAt { get; set; }

        public User User { get; set; }
        public ClassSchedule Class { get; set; }
    }
}