namespace gymbackend.Models
{
    public class Payment
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public decimal Amount { get; set; }
        public string StripePaymentIntentId { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}