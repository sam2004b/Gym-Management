using gymbackend.Data;
using gymbackend.DTOs;
using gymbackend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace gymbackend.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<string> Register(RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(x => x.Email == dto.Email))
                throw new Exception("Email already exists");

            var role = dto.Role.Trim().ToLower();

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = role,
                PhoneNumber = dto.PhoneNumber,
                BirthDate = DateTime.SpecifyKind(dto.BirthDate, DateTimeKind.Utc),
                Address = dto.Address,
                IsApproved = role == "trainer" ? false : true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return GenerateToken(user);
        }

        public async Task<string> Login(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == dto.Email && x.IsActive);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new Exception("Invalid credentials");

            if (user.Role == "trainer" && !user.IsApproved)
                throw new Exception("Trainer account not approved yet");

            return GenerateToken(user);
        }

        public async Task<User> GetProfile(Guid userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        public async Task UpdateProfile(Guid userId, UpdateProfileDto dto)
        {
            var user = await _context.Users.FindAsync(userId);

            user.FullName = dto.FullName;
            user.PhoneNumber = dto.PhoneNumber;
            user.Address = dto.Address;

            await _context.SaveChangesAsync();
        }

        public async Task ApproveTrainer(Guid trainerId)
        {
            var trainer = await _context.Users
                .FirstOrDefaultAsync(x => x.Id == trainerId && x.Role == "trainer");

            if (trainer == null)
                throw new Exception("Trainer not found");

            trainer.IsApproved = true;
            await _context.SaveChangesAsync();
        }

        public async Task<List<TrainerListDto>> GetApprovedTrainers()
        {
            return await _context.Users
                .Where(x => x.Role == "trainer" && x.IsApproved)
                .Select(x => new TrainerListDto
                {
                    Id = x.Id,
                    FullName = x.FullName,
                    Email = x.Email
                })
                .ToListAsync();
        }

        private string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"])
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
