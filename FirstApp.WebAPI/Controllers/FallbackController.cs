using Microsoft.AspNetCore.Mvc;

namespace FirstApp.WebAPI.Controllers
{
    //if any angular route will be accessed using 5178 then it will redirected index of angular
    public class FallbackController : Controller
    {
        public ActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"), "text/html");
        }
    }
}
