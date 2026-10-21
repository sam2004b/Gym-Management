using gymbackend.DTOs;

namespace gymbackend.Services
{
    public interface IMembershipService
    {
        List<string> GetSubscriptionTypes();
        Task<List<MembershipResponseDto>> GetUserSubscriptions(Guid userId);
        Task<MembershipResponseDto> PurchaseOrRenewMembership(Guid userId, string subscriptionType);
        Task<List<MembershipResponseDto>> GetAllMemberships();
    }
}