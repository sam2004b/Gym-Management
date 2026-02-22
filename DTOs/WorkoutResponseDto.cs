using System;
using System.Collections.Generic;

namespace gymbackend.DTOs
{
    public class WorkoutResponseDto
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public int DurationInWeeks { get; set; }
    public List<WorkoutExerciseDto>? Exercises { get; set; }
}
}