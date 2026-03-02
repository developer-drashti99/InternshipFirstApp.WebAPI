using FirstApp.WebAPI;
using FirstApp.WebAPI.Data;
using FirstApp.WebAPI.Data.Repos;
using FirstApp.WebAPI.Helpers;
using FirstApp.WebAPI.Interfaces;
using FirstApp.WebAPI.Mapping;
using FirstApp.WebAPI.Middleware;
using FirstApp.WebAPI.Services;
using FirstApp.WebAPI.SignalR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
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
builder.Services.AddScoped<IPhotoService, PhotoService>();
builder.Services.AddScoped<IMemberRepository, MemberRepository>();
builder.Services.AddScoped<ILikesRepository, LikesRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();

builder.Services.AddScoped<LogUserActivity>();

// added automapper to the service container and specified the mapping profile
builder.Services.AddAutoMapper(typeof(MappingProfile));

//configured cloudinary api with key
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));

builder.Services.AddSignalR();

builder.Services.AddSingleton<PresenceTracker>();

//added identity core to the service container and specified the user and role types, as well as the database context for storing user information for authentication and authorization purposes. Also configured password and user options for identity.
builder.Services.AddIdentityCore<AppUser>(options =>
{
    options.Password.RequireNonAlphanumeric = false;
    options.User.RequireUniqueEmail = true;
}).AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>();


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

        // SignalR sends JWT token in query string (?access_token=...)
        // instead of Authorization header during WebSocket connection.
        // This extracts the token from the query string for hub requests
        // so ASP.NET Core can validate the user properly.

        //“SignalR → token comes from query string, not header.”
        //new JwtBearerEvents()
        //{
        //    OnMessageReceived = context =>
        //    {
        //        var accessToken = context.Request.Query["access_token"];

        //        var path = context.HttpContext.Request.Path;

        //        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
        //        {
        //            context.Token = accessToken;
        //        }

        //        return Task.CompletedTask;
        //    }
        //}; 
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;

                if (!string.IsNullOrEmpty(accessToken) &&
                    path.StartsWithSegments("/hubs"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });


//added custom policy-based authorization ,"RequireAdminRole" for admin and "ModeratePhotoRole" for admin and moderator,These policies can be used to restrict access to certain actions or controllers based on the user's role.
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("RequireAdminRole",policy=>policy.RequireRole("Admin"))
    .AddPolicy("ModeratePhotoRole", policy=>policy.RequireRole("Admin","Moderator"));


//configure the HTTP request pipeline
var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

// app.UseDeveloperExceptionPage();

app.UseCors(policy =>
    policy.AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("http://localhost:4200", "https://localhost:4200")
    // .AllowAnyOrigin()
    //.WithOrigins("http://localhost:4200/", "https://localhost:4200/")
    );

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<PresenceHub>("hubs/presence");
app.MapHub<MessageHub>("hubs/messages");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<AppDbContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    
    //in the case of restarting server(app) connections data will be releases
    await context.Connections.ExecuteDeleteAsync();

    await Seed.SeedUsers(userManager);

}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "error in code during migration");
}

app.Run();
