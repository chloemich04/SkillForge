using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillForge.Api.Data;
using SkillForge.Api.DTOs;
using SkillForge.Api.Models;

namespace SkillForge.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ActivityLogsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ActivityLogsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ActivityLogDto>>> GetAll()
    {
        var logs = await _db.ActivityLogs
            .Include(l => l.Skill)
            .OrderByDescending(l => l.Date)
            .Select(l => l.ToDto())
            .ToListAsync();
        
        return Ok(logs);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ActivityLogDto>> GetById(int id)
    {
        var log = await _db.ActivityLogs
            .Include(l => l.Skill)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (log is null) return NotFound();

        return Ok(log.ToDto());
    }

    [HttpPost]
    public async Task<ActionResult<ActivityLogDto>> Create(CreateActivityLogDto dto)
    {
        var skill = await _db.Skills.FindAsync(dto.SkillId);
        if (skill is null) return BadRequest("Invaild SkillId.");
        
        var log = new ActivityLog
        {
            SkillId = dto.SkillId,
            Date = dto.Date,
            Minutes = dto.Minutes,
            Notes = dto.Notes
        };

        _db.ActivityLogs.Add(log);
        await _db.SaveChangesAsync();

        // Reload with Skill for DTO
        await _db.Entry(log).Reference(l => l.Skill).LoadAsync();

        return CreatedAtAction(nameof(GetById), new { id = log.Id }, log.ToDto());
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateActivityLogDto dto)
    {
        var log = await _db.ActivityLogs.FindAsync(id);
        if (log is null) return NotFound();

        log.Date = dto.Date;
        log.Minutes = dto.Minutes;
        log.Notes = dto.Notes;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var log = await _db.ActivityLogs.FindAsync(id);
        if (log is null) return NotFound();

        _db.ActivityLogs.Remove(log);
        await _db.SaveChangesAsync();
        return NoContent();
    }    
}