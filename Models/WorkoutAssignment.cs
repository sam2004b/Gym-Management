namespace gymbackend.Models
{
    public class WorkoutAssignment
    {
        public Guid Id { get; set; }

        public Guid WorkoutPlanId { get; set; }

        public Guid MemberId { get; set; }

        public Guid TrainerId { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;
    }
}