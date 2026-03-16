namespace gymbackend.Models
{
    public class ClassBooking
    {
        public Guid Id { get; set; }

        public Guid ClassId { get; set; }

        public Guid MemberId { get; set; }

        public DateTime BookedAt { get; set; } = DateTime.UtcNow;
    }
}