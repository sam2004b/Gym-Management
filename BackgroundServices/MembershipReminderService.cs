using gymbackend.Data;
using gymbackend.Services;
using Microsoft.EntityFrameworkCore;

namespace gymbackend.BackgroundServices
{
    public class MembershipReminderService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public MembershipReminderService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _scopeFactory.CreateScope();

                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var notificationService = scope.ServiceProvider.GetRequiredService<NotificationService>();

                var targetDate = DateTime.UtcNow.AddDays(2).Date;

                var memberships = await context.Memberships
                    .Where(m => m.ExpiryDate.Date == targetDate && m.IsActive)
                    .ToListAsync();

                foreach (var membership in memberships)
                {
                    await notificationService.CreateNotification(
                        membership.UserId,
                        "Membership Expiring Soon ⚠️",
                        "Your membership will expire in 2 days. Renew now.",
                        "Renewal"
                    );
                }

                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }
    }
}