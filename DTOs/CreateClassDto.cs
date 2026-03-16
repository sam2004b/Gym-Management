namespace gymbackend.DTOs
{
    public class CreateClassDto
    {
        public string ClassName { get; set; }

        public string Day { get; set; }

        public TimeSpan Time { get; set; }

        public int Capacity { get; set; }
    }
}