using gymbackend.DTOs;
using gymbackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
public class FeedbackController : ControllerBase
{
    private readonly IFeedbackService _service;

    public FeedbackController(IFeedbackService service)
    {
        _service = service;
    }

    [Authorize(Roles = "Member")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateFeedbackDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        await _service.CreateFeedback(userId, dto);
        return Ok("Feedback submitted");
    }

    [Authorize(Roles = "Member")]
    [HttpGet("my")]
    public async Task<IActionResult> GetMy()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        var result = await _service.GetMyFeedback(userId);
        return Ok(result);
    }

    [Authorize(Roles = "admin")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllFeedback();
        return Ok(result);
    }

    [Authorize(Roles = "trainer")]
    [HttpGet("trainer")]
    public async Task<IActionResult> GetTrainerFeedback()
    {
        var trainerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        var result = await _service.GetTrainerFeedback(trainerId);
        return Ok(result);
    }
}