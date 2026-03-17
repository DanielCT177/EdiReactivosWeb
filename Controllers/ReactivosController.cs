using Microsoft.AspNetCore.Mvc;

namespace EdiReactivosWeb.Controllers
{
    public class ReactivosController : Controller
    {
        // GET: /Reactivos/Index
        public IActionResult Index()
        {
            return View(); // Esto busca Index.cshtml
        }
    }
}