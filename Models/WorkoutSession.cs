using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gymbackend.Models
{
    public class WorkoutSession
    {
        public Guid Id { get; set; }

        [Required]
        public Guid MemberId { get; set; }

        [ForeignKey("MemberId")]
        public User Member { get; set; }

        [Required]
        public Guid WorkoutPlanId { get; set; }

        [ForeignKey("WorkoutPlanId")]
        public WorkoutPlan WorkoutPlan { get; set; }

        [Required]
        public DateTime SessionDate { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        public bool IsCompleted { get; set; } = false;
    }
}