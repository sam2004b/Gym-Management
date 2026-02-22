namespace gymbackend.DTOs
{
    public class CreateWorkoutDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int DurationInWeeks { get; set; }
        public List<CreateExerciseDto> Exercises { get; set; }
    }

    public class CreateExerciseDto
    {
        public string ExerciseName { get; set; }
        public int Sets { get; set; }
        public int Reps { get; set; }
        public string Day { get; set; }
    }
}