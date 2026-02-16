namespace gymbackend.DTOs
{
    public class MembershipResponseDto
    {
        public Guid UserId { get; set; }
        public string SubscriptionType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public bool IsActive { get; set; }
    }
}
