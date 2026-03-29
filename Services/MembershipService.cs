using gymbackend.Data;
using gymbackend.DTOs;
using gymbackend.Models;
using Microsoft.EntityFrameworkCore;

namespace gymbackend.Services
{
    public class MembershipService : IMembershipService
    {
        private readonly ApplicationDbContext _context;

        public MembershipService(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<string> GetSubscriptionTypes()
        {
            return new List<string>
            {
                "monthly",
                "quarterly",
                "yearly"
            };
        }

        public async Task<List<MembershipResponseDto>> GetUserSubscriptions(Guid userId)
        {
            var memberships = await _context.Memberships
                .Where(m => m.UserId == userId && m.IsActive)
                .OrderByDescending(m => m.StartDate)
                .ToListAsync();

            return memberships.Select(m => new MembershipResponseDto
            {
                UserId = m.UserId,
                SubscriptionType = m.SubscriptionType,
                StartDate = m.StartDate,
                ExpiryDate = m.ExpiryDate,
                IsActive = m.ExpiryDate > DateTime.UtcNow,
                Price = GetPrice(m.SubscriptionType) 
            }).ToList();
        }

        public async Task<MembershipResponseDto> PurchaseOrRenewMembership(Guid userId, string subscriptionType)
        {
            subscriptionType = subscriptionType.Trim().ToLower();

            int monthsToAdd = subscriptionType switch
            {
                "monthly" => 1,
                "quarterly" => 3,
                "yearly" => 12,
                _ => throw new Exception("Invalid subscription type")
            };

            var existingMembership = await _context.Memberships
                .FirstOrDefaultAsync(x => x.UserId == userId && x.IsActive);

            DateTime startDate = DateTime.UtcNow;

            if (existingMembership != null && existingMembership.ExpiryDate > DateTime.UtcNow)
            {
                startDate = existingMembership.ExpiryDate;
                existingMembership.ExpiryDate = existingMembership.ExpiryDate.AddMonths(monthsToAdd);

                await _context.SaveChangesAsync();

                return new MembershipResponseDto
                {
                    UserId = userId,
                    SubscriptionType = existingMembership.SubscriptionType,
                    StartDate = existingMembership.StartDate,
                    ExpiryDate = existingMembership.ExpiryDate,
                    IsActive = true,
                    Price = GetPrice(existingMembership.SubscriptionType)
                };
            }

            var membership = new Membership
            {
                UserId = userId,
                SubscriptionType = subscriptionType,
                StartDate = startDate,
                ExpiryDate = startDate.AddMonths(monthsToAdd),
                IsActive = true
            };

            _context.Memberships.Add(membership);
            await _context.SaveChangesAsync();

            return new MembershipResponseDto
            {
                UserId = userId,
                SubscriptionType = subscriptionType,
                StartDate = membership.StartDate,
                ExpiryDate = membership.ExpiryDate,
                IsActive = true,
                Price = GetPrice(subscriptionType)
            };
        }

        public async Task<List<MembershipResponseDto>> GetAllMemberships()
        {
            return await _context.Memberships
                .Include(x => x.User)
                .Select(x => new MembershipResponseDto
                {
                    UserId = x.UserId,
                    SubscriptionType = x.SubscriptionType,
                    StartDate = x.StartDate,
                    ExpiryDate = x.ExpiryDate,
                    IsActive = x.IsActive,
                    Price = GetPrice(x.SubscriptionType)
                })
                .ToListAsync();
        }

        private decimal GetPrice(string type)
        {
            return type.ToLower() switch
            {
                "monthly" => 49.99m,
                "quarterly" => 129.99m,
                "yearly" => 449.99m,
                _ => 0
            };
        }
    }
}