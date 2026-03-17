using Microsoft.AspNetCore.Mvc;

namespace EdiReactivosWeb.Controllers
{
    public class GuiaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Upload()
        {
            return View();
        }
    }
}