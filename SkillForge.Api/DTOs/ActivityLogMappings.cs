using SkillForge.Api.Models;

namespace SkillForge.Api.DTOs;

public static class ActivityLogMappings
{
    public static ActivityLogDto ToDto(this ActivityLog log) =>
        new(log.Id, log.SkillId, log.Skill.Name, log.Date, log.Minutes, log.Notes);
}