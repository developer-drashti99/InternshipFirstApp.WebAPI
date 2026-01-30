using FirstApp.WebAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace FirstApp.WebAPI
{
    public class AppDbContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<AppUser> Users { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<Photo> Photos { get; set; }
    }
}