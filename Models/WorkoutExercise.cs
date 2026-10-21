using System.ComponentModel.DataAnnotations;

namespace gymbackend.Models
{
    public class WorkoutExercise
    {
        public Guid Id { get; set; }

        [Required]
        public Guid WorkoutPlanId { get; set; }

        [Required]
        public string ExerciseName { get; set; }

        public int Sets { get; set; }

        public int Reps { get; set; }

        public string Day { get; set; }

        public WorkoutPlan WorkoutPlan { get; set; }
    }
}