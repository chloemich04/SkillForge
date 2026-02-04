namespace SkillForge.Api.Models;

public class ActivityLog
{
    public int Id {get; set; }
    
    public int SkillId { get; set; }
    public Skill Skill { get; set; }

    public DateOnly Date { get; set; }
    public int Minutes { get; set; }

    public string? Notes { get; set; }
}