using gymbackend.DTOs;
using gymbackend.Services;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost("create-payment-intent")]
    public async Task<IActionResult> CreatePaymentIntent(CreatePaymentDto dto)
    {
        var clientSecret = await _paymentService.CreatePaymentIntentAsync(dto);
        return Ok(new { clientSecret });
    }
}