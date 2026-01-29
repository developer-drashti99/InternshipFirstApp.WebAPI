using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace FirstApp.WebAPI.DTOs
{
    public class AuthUserDto
    {
        public string EmpId { get; set; }
      public required string DisplayName { get; set; }
        public required string Email { get; set; }
        public string? ImageUrl { get; set; }
        public string Token { get; set; }
    }

}