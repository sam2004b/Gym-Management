using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gymbackend.Models
{
    public class Attendance
    {
        public Guid Id { get; set; }

        [Required]
        public Guid MemberId { get; set; }

        [ForeignKey("MemberId")]
        public User Member { get; set; }

        public DateTime CheckInTime { get; set; } = DateTime.UtcNow;
    }
}