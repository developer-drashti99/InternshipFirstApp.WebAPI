using FirstApp.WebAPI.DTOs;
using FirstApp.WebAPI.Interfaces;

namespace FirstApp.WebAPI.Extensions
{
    public static class AppEmployeeExtensions
    {
        public static EmployeeDto ToDto(this Employee employee)
        {
            return new EmployeeDto
            {
                EmpId = employee.EmpId,
                DisplayName = employee.DisplayName,
                Email = employee.Email,
            };
        }
        public static AuthUserDto ToAuthDto(this Employee employee,ITokenService tokenService)
        {
            return new AuthUserDto
            {
                EmpId = employee.EmpId,
                DisplayName = employee.DisplayName,
                Email = employee.Email,
                Token = tokenService.CreateToken(employee)
            };
        }
    }
}
