using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillForge.Api.Data;
using SkillForge.Api.DTOs;
using SkillForge.Api.Models;

namespace SkillForge.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SkillsController : ControllerBase
{
    private readonly AppDbContext _db;

    public SkillsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SkillDto>>> GetAll()
    {
        var skills = await _db.Skills
        .Select(s => s.ToDto())
        .ToListAsync();

        return Ok(skills);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<SkillDto>> GetById(int id)
    {
        var skill = await _db.Skills.FindAsync(id);
        if (skill is null) return NotFound();

        return Ok(skill.ToDto());
    }

    [HttpPost]
    public async Task<ActionResult<SkillDto>> Create(CreateSkillDto dto)
    {
        var name = dto.Name.Trim();
        if (string.IsNullOrWhiteSpace(name)) return BadRequest("Name is required.");

        var skill = new Skill
        {
            Name = name,
            Description = dto.Description
        };

        _db.Skills.Add(skill);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = skill.Id }, skill.ToDto());
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateSkillDto dto)
    {
        var skill = await _db.Skills.FindAsync(id);
        if (skill is null) return NotFound();

        var name = dto.Name.Trim();
        if (string.IsNullOrWhiteSpace(name)) return BadRequest("Name is required.");

        skill.Name = name;
        skill.Description = dto.Description;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var skill = await _db.Skills.FindAsync(id);
        if (skill is null) return NotFound();

        _db.Skills.Remove(skill);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}