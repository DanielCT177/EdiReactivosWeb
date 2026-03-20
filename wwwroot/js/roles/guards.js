// wwwroot/js/roles/guards.js
import { Roles } from './constants.js';
import { hasPermission } from './permissions.js';
import { isRouteAllowed, roleRedirects } from './routes.js'; // Importar roleRedirects

// Obtener rol del usuario
export function getUserRole() {
    return localStorage.getItem('role');
}

// Obtener usuario completo
export function getUser() {
    try {
        const usuario = localStorage.getItem('usuario');
        return usuario ? JSON.parse(usuario) : null;
    } catch (error) {
        console.error('Error parsing usuario:', error);
        return null;
    }
}

// Verificar si está autenticado
export function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// Verificar rol específico
export function hasRole(rol) {
    return getUserRole() === rol;
}

// Verificar múltiples roles (alguno)
export function hasAnyRole(roles) {
    const userRole = getUserRole();
    return roles.includes(userRole);
}

// Verificar múltiples roles (todos)
export function hasAllRoles(roles) {
    const userRole = getUserRole();
    return roles.every(rol => userRole === rol);
}

// Verificar permiso específico
export function can(permiso) {
    const userRole = getUserRole();
    return hasPermission(userRole, permiso);
}

// Guardia de rutas
export function routeGuard() {
    const currentPath = window.location.pathname.toLowerCase();
    const userRole = getUserRole();
    
    // Rutas públicas
    const publicRoutes = ['/auth/login', '/home/accessdenied', '/'];
    
    // Si es ruta pública, permitir acceso
    if (publicRoutes.some(route => currentPath.includes(route))) {
        return true;
    }
    
    // Verificar autenticación
    if (!isAuthenticated()) {
        window.location.href = '/Auth/Login';
        return false;
    }
    
    // Verificar si la ruta está permitida para su rol usando routes.js
    if (!isRouteAllowed(userRole, currentPath)) {
        console.log('🚫 Acceso denegado a:', currentPath, 'para rol:', userRole);
        window.location.href = '/Home/AccessDenied';
        return false;
    }
    
    return true;
}

// Redirigir según el rol - AHORA USA roleRedirects DE ROUTES.JS
export function redirectBasedOnRole() {
    const userRole = getUserRole();
    console.log('Redirigiendo según rol:', userRole);
    
    // ✅ USAR roleRedirects de routes.js en lugar de rutas hardcodeadas
    const ruta = roleRedirects[userRole] || '/Dashboard/Index';
    console.log('Destino:', ruta);
    window.location.href = ruta;
}

// Cerrar sesión
export function logout() {
    console.log('Cerrando sesión...');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('correo');
    localStorage.removeItem('role');
    sessionStorage.clear();
    window.location.href = '/Auth/Login';
}

export default {
    getUserRole,
    getUser,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    can,
    routeGuard,
    redirectBasedOnRole,
    logout
};