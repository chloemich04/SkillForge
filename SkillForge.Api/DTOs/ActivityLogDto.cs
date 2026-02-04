namespace SkillForge.Api.DTOs;

public record ActivityLogDto(
    int Id,
    int SkillId,
    string SkillName,
    DateOnly Date,
    int Minutes,
    string? Notes
);