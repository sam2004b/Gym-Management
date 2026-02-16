using gymbackend.DTOs;

namespace gymbackend.Services
{
    public interface IMembershipService
    {
        List<string> GetSubscriptionTypes();
        Task<MembershipResponseDto> PurchaseOrRenewMembership(Guid userId, string subscriptionType);
        Task<List<MembershipResponseDto>> GetAllMemberships();
    }
}
