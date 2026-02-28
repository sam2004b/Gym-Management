using gymbackend.DTOs;

public interface IPaymentService
{
    Task<string> CreatePaymentIntentAsync(CreatePaymentDto dto);
}