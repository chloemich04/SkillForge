using Microsoft.EntityFrameworkCore;
using SkillForge.Api.Models;

namespace SkillForge.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Skill> Skills => Set<Skill>();
}