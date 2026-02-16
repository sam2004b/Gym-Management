using System.ComponentModel.DataAnnotations;

namespace gymbackend.DTOs
{
    public class PurchaseMembershipDto
    {
        [Required]
        public string SubscriptionType { get; set; }
    }
}
