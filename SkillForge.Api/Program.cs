using Microsoft.EntityFrameworkCore;
using SkillForge.Api.Data;
using SkillForge.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("SkillForge"));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!db.Skills.Any())
    {
        db.Skills.AddRange(
            new SkillForge.Api.Models.Skill { Name = "C#", Description = "Core language fundamentals"},
            new Skill { Name = "React", Description = "Component-based UI development" }
        );

        db.SaveChanges();
    }

    if (!db.ActivityLogs.Any())
    {
        db.ActivityLogs.AddRange(
            new ActivityLog
            {
                SkillId = db.Skills.First().Id,
                Date = DateOnly.FromDateTime(DateTime.Today),
                Minutes = 45,
                Notes = "Warm-up practice"
            },
            new ActivityLog
            {
                SkillId = db.Skills.Skip(1).First().Id,
                Date = DateOnly.FromDateTime(DateTime.Today.AddDays(-1)),
                Minutes = 30,
                Notes = "Built a small component"
            }
        );

        db.SaveChanges();
    }

}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();


