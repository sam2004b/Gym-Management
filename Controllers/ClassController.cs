using gymbackend.DTOs;
using gymbackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace gymbackend.Controllers
{
    [ApiController]
    [Route("api/classes")]
    public class ClassesController : ControllerBase
    {
        private readonly IClassService _service;

        public ClassesController(IClassService service)
        {
            _service = service;
        }

        [Authorize(Roles = "trainer,admin")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateClass(CreateClassDto dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            await _service.CreateClass(userId, dto);

            return Ok("Class created");
        }

        [Authorize(Roles = "trainer,admin")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteClass(Guid id)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            await _service.DeleteClass(userId, id);

            return Ok("Class deleted");
        }

        [Authorize(Roles = "trainer")]
        [HttpGet("my-classes")]
        public async Task<IActionResult> GetMyClasses()
        {
            var trainerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var classes = await _service.GetTrainerClasses(trainerId);

            return Ok(classes);
        }

        [Authorize(Roles = "member,admin")]
        [HttpGet]
        public async Task<IActionResult> GetClasses()
        {
            var classes = await _service.GetAvailableClasses();

            return Ok(classes);
        }

        [Authorize(Roles = "member,admin")]
        [HttpPost("book")]
        public async Task<IActionResult> BookClass(BookClassDto dto)
        {
            var memberId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            await _service.BookClass(memberId, dto);

            return Ok("Class booked successfully");
        }

        [Authorize(Roles = "member")]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyBookedClasses()
        {
            var memberId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var classes = await _service.GetMemberBookedClasses(memberId);

            return Ok(classes);
        }

        [Authorize(Roles = "member")]
        [HttpDelete("cancel/{classId}")]
        public async Task<IActionResult> CancelBooking(Guid classId)
        {
            var memberId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            await _service.CancelBooking(memberId, classId);

            return Ok("Booking cancelled");
        }

        [Authorize(Roles = "trainer")]
        [HttpGet("trainer/members")]
        public async Task<IActionResult> GetTrainerMembers()
        {
            var trainerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var members = await _service.GetTrainerMembers(trainerId);

            return Ok(members);
        }
    }
}