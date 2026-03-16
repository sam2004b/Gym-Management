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

        [Authorize(Roles = "trainer")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateClass(CreateClassDto dto)
        {
            var trainerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            await _service.CreateClass(trainerId, dto);

            return Ok("Class created");
        }

        [Authorize(Roles = "trainer")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteClass(Guid id)
        {
            var trainerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            await _service.DeleteClass(trainerId, id);

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

        [Authorize(Roles = "Member")]
        [HttpGet]
        public async Task<IActionResult> GetClasses()
        {
            var classes = await _service.GetAvailableClasses();

            return Ok(classes);
        }

        [Authorize(Roles = "Member")]
        [HttpPost("book")]
        public async Task<IActionResult> BookClass(BookClassDto dto)
        {
            var memberId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            await _service.BookClass(memberId, dto);

            return Ok("Class booked successfully");
        }
    }
}