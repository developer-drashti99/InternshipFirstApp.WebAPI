using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace FirstApp.WebAPI
{
    public class AppDbContext(DbContextOptions options):DbContext(options)
    {
     public DbSet<Employee> Employees { get; set; }   
    }
}