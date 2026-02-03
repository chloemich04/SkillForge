using SkillForge.Api.Models;

namespace SkillForge.Api.DTOs;

public static class SkillMappings
{
    public static SkillDto ToDto(this Skill skill) =>
        new(skill.Id, skill.Name, skill.Description);
}