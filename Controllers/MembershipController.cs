using gymbackend.DTOs;
using gymbackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace gymbackend.Controllers
{
    [ApiController]
    [Route("api/membership")]
    public class MembershipController : ControllerBase
    {
        private readonly IMembershipService _membershipService;

        public MembershipController(IMembershipService membershipService)
        {
            _membershipService = membershipService;
        }

        [HttpGet("subscriptions")]
        public IActionResult GetSubscriptionTypes()
        {
            return Ok(_membershipService.GetSubscriptionTypes());
        }

        [Authorize]
        [HttpPost("purchase")]
        public async Task<IActionResult> PurchaseMembership(PurchaseMembershipDto dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var result = await _membershipService.PurchaseOrRenewMembership(userId, dto.SubscriptionType);
            return Ok(result);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("admin/all")]
        public async Task<IActionResult> GetAllMemberships()
        {
            var memberships = await _membershipService.GetAllMemberships();
            return Ok(memberships);
        }
    }
}
