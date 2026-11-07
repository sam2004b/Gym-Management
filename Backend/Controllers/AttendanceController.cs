using gymbackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace gymbackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        [HttpPost("checkin")]
        public async Task<IActionResult> CheckIn()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            await _attendanceService.CheckIn(userId);

            return Ok("Attendance marked successfully.");
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetMyAttendance()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var history = await _attendanceService.GetMyAttendance(userId);

            return Ok(history);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin/member/{memberId}")]
        public async Task<IActionResult> GetMemberAttendance(Guid memberId)
        {
            var history = await _attendanceService.GetMemberAttendance(memberId);

            return Ok(history);
        }
    }
}