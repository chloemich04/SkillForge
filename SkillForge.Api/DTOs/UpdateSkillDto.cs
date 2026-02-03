using System.ComponentModel.DataAnnotations;

namespace SkillForge.Api.DTOs;

public record UpdateSkillDto(
    [param: Required]
    [param: StringLength(100, MinimumLength = 2)]
    string Name,

    [param: StringLength(500)]
    string? Description
);