using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FirstApp.WebAPI.Controllers
{
    public class BuggyController : BaseApiController
    {
        [HttpGet("auth")]
        public IActionResult GetAuth()
        {
            return Unauthorized();
        }
        [HttpGet("not-found")]
        public IActionResult GetNotFound()
        {
            return NotFound();
        }
        [HttpGet("server-error")]
        public IActionResult GetServerError()
        {
            throw new Exception("This is a Server Error");
        }
        [HttpGet("bad-request")]
        public IActionResult GetBadRequest()
        {
            return BadRequest("This is not a good request");
            // throw new Exception("This is not a good request");
        }

        [HttpGet("admin-secret")]
        [Authorize(Roles = "Admin")]
        public ActionResult<string> GetSecretAdmin()
        {
            return Ok("Only Admin should see them");
        }
    }
}
