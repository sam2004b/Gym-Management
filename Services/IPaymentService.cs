using gymbackend.DTOs;
using gymbackend.Models;

public interface IPaymentService
{
    Task<string> CreatePaymentIntentAsync(CreatePaymentDto dto);
    Task UpdatePaymentAsync(SavePaymentDto dto);
    Task<List<Payment>> GetPaymentsByUserAsync(Guid userId);
   Task<List<Payment>> GetAllPaymentsAsync();
    
}