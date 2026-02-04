using System.ComponentModel.DataAnnotations;

namespace SkillForge.Api.DTOs;

public record UpdateActivityLogDto(
    [param: Required]
    DateOnly Date,

    [param: Range(1,600)]
    int Minutes,

    [param: StringLength(500)]
    string? Notes
);