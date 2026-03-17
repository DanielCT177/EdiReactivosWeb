using Microsoft.AspNetCore.Mvc;

namespace EdiReactivosWeb.Controllers
{
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}