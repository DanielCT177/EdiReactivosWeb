// wwwroot/js/roles/routes.js
import { Roles } from './constants.js';

// Rutas públicas
export const publicRoutes = [
    '/',
    '/Auth/Login',
    '/Home/AccessDenied'
];

// Rutas protegidas por rol
export const protectedRoutes = {
    // Dashboard - solo Admin y Coordinador
    '/Dashboard': [ Roles.COORDINADOR],
    
    // Guías - TODOS los roles
    '/Guia': [Roles.ADMINISTRADOR, Roles.DOCENTE, Roles.COORDINADOR, Roles.SOPORTE, Roles.ALUMNO],
    
    // Reactivos - Admin y Docente
    '/Reactivos': [Roles.ADMINISTRADOR, Roles.DOCENTE]
};

// REDIRECCIONES POR ROL
export const roleRedirects = {
    [Roles.ADMINISTRADOR]: '/Guia/Index',
    [Roles.DOCENTE]: '/Guia/Index',
    [Roles.ALUMNO]: '/Guia/Index',
    [Roles.COORDINADOR]: '/Guia/Index',
    [Roles.SOPORTE]: '/Guia/Index'
};

export function isRouteAllowed(rol, ruta) {
    // Normalizar ruta (minúsculas para comparar)
    const rutaLower = ruta.toLowerCase();
    console.log("ROLES PERMITIDOS:", allowedRoles); // ❌
    // Verificar rutas públicas
    if (publicRoutes.some(r => rutaLower.startsWith(r.toLowerCase()))) {
        return true;
    }
    
    // Verificar rutas protegidas
    for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
        if (rutaLower.startsWith(route.toLowerCase())) {
            // Comparar rol exactamente
            const permitido = allowedRoles.includes(rol);
            console.log(`🔍 Ruta ${route}: ${permitido ? '✅' : '❌'} para ${rol}`);
            return permitido;
        }
    }
    
    // 🚫 IMPORTANTE: Si la ruta no está en protectedRoutes, DENEGAR ACCESO
    console.log(`⚠️ Ruta ${ruta} no definida en protectedRoutes, DENEGANDO`);
    return false;
}

export default { publicRoutes, protectedRoutes, roleRedirects, isRouteAllowed };