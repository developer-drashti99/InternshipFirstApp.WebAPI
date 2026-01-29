using FirstApp.WebAPI;
using FirstApp.WebAPI.Data;
using FirstApp.WebAPI.Interfaces;
using FirstApp.WebAPI.Middleware;
using FirstApp.WebAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors();

builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var tokenKey = builder.Configuration["TokenKey"] ??
        throw new Exception("No JWT Key Found -program.cs");

        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),
            ValidateAudience = false,
            ValidateIssuer = false
        };
    });


//configure the HTTP request pipeline
var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

// app.UseDeveloperExceptionPage();

app.UseCors(policy =>
    policy.AllowAnyHeader()
    .AllowAnyMethod()
    .WithOrigins("http://localhost:4200", "https://localhost:4200")
    // .AllowAnyOrigin()
    //.WithOrigins("http://localhost:4200/", "https://localhost:4200/")
    );

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using var scope=app.Services.CreateScope();
var services=scope.ServiceProvider;

try
{
    var context=services.GetRequiredService<AppDbContext>();
    await context.Database.MigrateAsync();
    await Seed.SeedUsers(context);
    
}
catch (Exception ex)
{
    var logger=services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex,"error in code during migration");
}

app.Run();
