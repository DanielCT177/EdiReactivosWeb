using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

public class AuthController : Controller
{
    // Mostrar vista
    public IActionResult Login()
    {
        return View();
    }

    // 🔥 ESTE ES EL IMPORTANTE (lo llamas desde JS)
    [HttpPost]
    public async Task<IActionResult> LoginBackend([FromBody] UsuarioDTO user)
    {
        if (user == null || string.IsNullOrEmpty(user.Rol))
            return BadRequest();

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Nombre ?? ""),
            new Claim(ClaimTypes.Email, user.Email ?? ""),
            new Claim(ClaimTypes.Role, user.Rol) // 🔥 AQUÍ VA EL ROL
        };

        var identity = new ClaimsIdentity(
            claims,
            CookieAuthenticationDefaults.AuthenticationScheme
        );

        var principal = new ClaimsPrincipal(identity);

        // 🔥 CREA LA COOKIE (AQUÍ .NET YA SABE QUIÉN ERES)
        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            principal
        );

        return Ok(new { success = true });
    }

    // 🔥 LOGOUT REAL (BORRA COOKIE)
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(
            CookieAuthenticationDefaults.AuthenticationScheme
        );

        return RedirectToAction("Login");
    }
}

// DTO para recibir datos desde JS
public class UsuarioDTO
{
    public string Nombre { get; set; }
    public string Email { get; set; }
    public string Rol { get; set; }
}