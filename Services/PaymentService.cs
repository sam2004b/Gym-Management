using gymbackend.Data;
using gymbackend.DTOs;
using gymbackend.Models;
using Microsoft.EntityFrameworkCore;
using Stripe;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

public class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public PaymentService(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?
            .User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userIdClaim == null)
            throw new Exception("User not authenticated");

        return Guid.Parse(userIdClaim);
    }

    public async Task<string> CreatePaymentIntentAsync(CreatePaymentDto dto)
    {
        var options = new PaymentIntentCreateOptions
        {
            Amount = (long)(dto.Amount * 100),
            Currency = "usd",
            PaymentMethodTypes = new List<string> { "card" },
        };

        var service = new PaymentIntentService();
        var intent = await service.CreateAsync(options);

        var userId = GetCurrentUserId();

        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Amount = dto.Amount,
            StripePaymentIntentId = intent.Id,
            Status = "Pending",
            Method = "Pending",
            Plan = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        return intent.ClientSecret;
    }

    public async Task UpdatePaymentAsync(SavePaymentDto dto)
    {
        var payment = await _context.Payments
            .FirstOrDefaultAsync(p => p.StripePaymentIntentId == dto.PaymentIntentId);

        if (payment == null)
        {
            var userId = GetCurrentUserId();

            payment = new Payment
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                StripePaymentIntentId = dto.PaymentIntentId,
                Amount = dto.Amount,
                Status = dto.Status,
                Method = dto.Method,
                Plan = dto.Plan,
                CreatedAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
        }
        else
        {
            payment.Status = dto.Status;
            payment.Method = dto.Method;
            payment.Plan = dto.Plan;

            if (dto.Amount > 0)
                payment.Amount = dto.Amount;
        }

        await _context.SaveChangesAsync();
    }

    public async Task<List<Payment>> GetPaymentsByUserAsync(Guid userId)
    {
        return await _context.Payments
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Payment>> GetAllPaymentsAsync()
    {
        return await _context.Payments
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<object>> GetAllPaymentsWithUsersAsync()
    {
        return await (
            from p in _context.Payments
            join u in _context.Users on p.UserId equals u.Id
            orderby p.CreatedAt descending
            select new
            {
                id = p.Id,
                userId = p.UserId,
                userName = u.FullName,
                amount = p.Amount,
                method = p.Method,
                status = p.Status,
                plan = p.Plan,
                createdAt = p.CreatedAt,
                stripePaymentIntentId = p.StripePaymentIntentId
            }
        ).ToListAsync<object>();
    }
}