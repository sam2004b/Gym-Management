using Microsoft.EntityFrameworkCore;
using gymbackend.Models;

namespace gymbackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Membership> Memberships { get; set; }
        public DbSet<WorkoutPlan> WorkoutPlans { get; set; }
        public DbSet<WorkoutExercise> WorkoutExercises { get; set; }
        public DbSet<WorkoutAssignment> WorkoutAssignments { get; set; }
        public DbSet<Payment> Payments { get; set; }

    }
}
