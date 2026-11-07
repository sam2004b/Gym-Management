using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gymbackend.Models
{
    public class WorkoutPlan
    {
        public Guid Id { get; set; }

        [Required]
        public Guid TrainerId { get; set; }

        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        public int DurationInWeeks { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;

        public ICollection<WorkoutExercise> Exercises { get; set; }
    }
}