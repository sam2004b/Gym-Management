using gymbackend.Data;
using gymbackend.DTOs;
using gymbackend.Models;
using Stripe;

public class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _context;

    public PaymentService(ApplicationDbContext context)
    {
        _context = context;
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

        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            UserId = dto.UserId,
            Amount = dto.Amount,
            StripePaymentIntentId = intent.Id,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        return intent.ClientSecret;
    }
}