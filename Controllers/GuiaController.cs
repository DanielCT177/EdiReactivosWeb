using Microsoft.AspNetCore.Mvc;

namespace EdiReactivosWeb.Controllers
{
    public class GuiaController : Controller
    {
        public IActionResult Index()
        {
            ViewData["Title"] = "Gestión de Guías PDF";
            return View();
        }
    }
}