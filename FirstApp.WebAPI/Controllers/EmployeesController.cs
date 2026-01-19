using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FirstApp.WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeesController(AppDbContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<Employee>>> GetEmployees()
        {
            try
            {
                List<Employee> employees = await context.Employees.ToListAsync();
                return employees.Count > 0 ? Ok(employees) : BadRequest("No Employees Found");
            }
            catch (Exception ex)
            {
                return BadRequest($"{ex.Message}  {ex.Data}");  
            }
        }

        [HttpGet("{empId}")]
        public ActionResult<Employee> GetEmployeeById(string empId)
        {
            try
            {
                Employee? employee = context.Employees.Find(empId);
                return employee != null ? Ok(employee) : BadRequest($"Employee Not Found having the empId {empId}");
            }
            catch (Exception ex)
            {
                return BadRequest($"{ex.Message}  {ex.Data}");
            }
        }

        [HttpDelete("{empId}")]
        public ActionResult DeleteEmployee(string empId)
        {
            try
            {
                Employee? employee = context.Employees.Find(empId);
                if (employee != null)
                {
                    context.Employees.Remove(employee);
                    context.SaveChanges();
                    return Ok($"Employee Deleted Successfully having the empId  {employee.EmpId}");
                }
                else
                    return BadRequest($"Employee Not Found having the empId {empId}");
            }
            catch (Exception ex)
            {
                return BadRequest($"{ex.Message}  {ex.Data}");
            }
        }

        [HttpPost]
        public ActionResult AddEmployee([FromBody]Employee employee)
        {
            try
            {
                context.Employees.Add(employee);
                context.SaveChanges();
                return Ok($"Employee Added Successfully having the empId {employee.EmpId}");
            }
            catch (Exception ex)
            {
                return BadRequest($"{ex.Message}  {ex.Data}");
            }
        }
    }
}
