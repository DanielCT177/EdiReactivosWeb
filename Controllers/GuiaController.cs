using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EdiReactivosWeb.Controllers
{
    public class GuiaController : Controller
    {
        [Authorize(Roles = "Administrador")]
        public IActionResult Index()
        {
            return View();
        }


    }
}