using gymbackend.DTOs;
using gymbackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace gymbackend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var token = await _authService.Register(dto);
            return Ok(new { token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var token = await _authService.Login(dto);
            return Ok(new { token });
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok("Logged out successfully");
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _authService.GetProfile(userId);
            return Ok(user);
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            await _authService.UpdateProfile(userId, dto);
            return Ok("Profile updated");
        }

        [Authorize(Roles = "admin")]
        [HttpPut("admin/approve-trainer/{id}")]
        public async Task<IActionResult> ApproveTrainer(Guid id)
        {
            await _authService.ApproveTrainer(id);
            return Ok("Trainer approved");
        }

        [Authorize]
        [HttpGet("trainers")]
        public async Task<IActionResult> GetTrainers()
        {
            var trainers = await _authService.GetApprovedTrainers();
            return Ok(trainers);
        }
    }
}
