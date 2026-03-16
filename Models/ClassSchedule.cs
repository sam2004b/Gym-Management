namespace gymbackend.Models
{
    public class ClassSchedule
    {
        public Guid Id { get; set; }

        public string ClassName { get; set; }

        public Guid TrainerId { get; set; }

        public string Day { get; set; }

        public TimeSpan Time { get; set; }

        public int Capacity { get; set; }

        public bool IsActive { get; set; } = true;
    }
}