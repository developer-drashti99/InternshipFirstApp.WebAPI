using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace FirstApp.WebAPI
{
    public class Employee
    {
        [Key]
        public string EmpId { get; set; }=Guid.NewGuid().ToString();
        public required string DisplayName { get; set; }
        public required string Email { get; set; }
    }
}