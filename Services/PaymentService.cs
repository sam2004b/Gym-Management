using gymbackend.Data;
using gymbackend.DTOs;
using gymbackend.Models;
using Microsoft.EntityFrameworkCore;
using Stripe;

public class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _context;

    public PaymentService(ApplicationDbContext context)
    {
        _context = context;
    }

    // ✅ CREATE PAYMENT INTENT (Stripe)
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

        // ✅ FIX: Add default values for Method & Plan
        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            UserId = dto.UserId,
            Amount = dto.Amount,
            StripePaymentIntentId = intent.Id,
            Status = "Pending",
            Method = "Pending",   // ✅ FIXED
            Plan = "Pending",     // ✅ FIXED
            CreatedAt = DateTime.UtcNow
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        return intent.ClientSecret;
    }

    // ✅ UPDATE PAYMENT AFTER SUCCESS
    public async Task UpdatePaymentAsync(SavePaymentDto dto)
    {
        var payment = await _context.Payments
            .FirstOrDefaultAsync(p => p.StripePaymentIntentId == dto.PaymentIntentId);

        if (payment == null)
            throw new Exception("Payment not found");

        payment.Status = dto.Status;
        payment.Method = dto.Method;
        payment.Plan = dto.Plan;

        await _context.SaveChangesAsync();
    }

    // ✅ GET PAYMENTS FOR USER
    public async Task<List<Payment>> GetPaymentsByUserAsync(Guid userId)
    {
        return await _context.Payments
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }
}