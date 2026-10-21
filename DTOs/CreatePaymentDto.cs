namespace gymbackend.DTOs
{
    public class CreatePaymentDto
    {
        public Guid UserId { get; set; }
        public decimal Amount { get; set; }
    }
}