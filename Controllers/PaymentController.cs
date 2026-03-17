using gymbackend.DTOs;
using gymbackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    // ✅ EXISTING - CREATE STRIPE PAYMENT INTENT
    [HttpPost("create-payment-intent")]
    public async Task<IActionResult> CreatePaymentIntent([FromBody] CreatePaymentDto dto)
    {
        var clientSecret = await _paymentService.CreatePaymentIntentAsync(dto);
        return Ok(new { clientSecret });
    }

    // ✅ 1. SAVE PAYMENT (UPDATE AFTER STRIPE SUCCESS)
    [HttpPost("save")]
    public async Task<IActionResult> SavePayment([FromBody] SavePaymentDto dto)
    {
        if (dto == null || string.IsNullOrEmpty(dto.PaymentIntentId))
            return BadRequest("Invalid payment data");

        await _paymentService.UpdatePaymentAsync(dto);

        return Ok(new
        {
            message = "Payment saved successfully"
        });
    }

    // ✅ 2. GET PAYMENT HISTORY (FOR LOGGED-IN USER)
    [Authorize] // remove if you are not using authentication yet
    [HttpGet]
    public async Task<IActionResult> GetPayments()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userIdClaim == null)
            return Unauthorized();

        var userId = Guid.Parse(userIdClaim);

        var payments = await _paymentService.GetPaymentsByUserAsync(userId);

        var response = payments.Select(p => new
        {
            id = $"RCP-{p.CreatedAt.Year}-{p.Id.ToString().Substring(0, 6)}",
            amount = p.Amount,
            method = p.Method,
            status = p.Status,
            plan = p.Plan,
            createdAt = p.CreatedAt
        });

        return Ok(response);
    }
}