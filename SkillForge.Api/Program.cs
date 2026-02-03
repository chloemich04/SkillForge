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


