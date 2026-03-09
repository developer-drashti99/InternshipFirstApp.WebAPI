using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FirstApp.WebAPI.DTOs
{
    public class ForgotPasswordDto
    {
        [EmailAddress]
        public required string Email { get; set; }
    }
}