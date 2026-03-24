using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EdiReactivosWeb.Controllers
{
    public class ReactivosController : Controller
    {
        [Authorize(Roles = "Administrador")]
        public IActionResult Index()
        {
            return View(); 
        }
    }
}