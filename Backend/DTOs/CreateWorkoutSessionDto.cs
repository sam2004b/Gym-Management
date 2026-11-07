using System.ComponentModel.DataAnnotations;

namespace gymbackend.DTOs
{
    public class CreateWorkoutSessionDto
    {
        [Required]
        public Guid MemberId { get; set; }

        [Required]
        public Guid WorkoutPlanId { get; set; }

        [Required]
        public DateTime SessionDate { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }
    }
}