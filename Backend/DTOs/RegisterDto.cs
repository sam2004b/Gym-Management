using System.ComponentModel.DataAnnotations;

namespace gymbackend.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string FullName { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Role { get; set; }

        [Required]
        public string PhoneNumber { get; set; }

        public DateTime BirthDate { get; set; }

        public string Address { get; set; }
    }
}
