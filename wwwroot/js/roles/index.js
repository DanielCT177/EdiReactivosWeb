// wwwroot/js/roles/index.js
// Exportar desde constants.js
export { default as Roles, RoleColors, RoleIcons } from './constants.js';

// Exportar desde permissions.js
export { default as Permissions, hasPermission, getPermissionsByRole } from './permissions.js';

// Exportar desde routes.js
export { default as Routes, publicRoutes, protectedRoutes, roleRedirects, isRouteAllowed } from './routes.js';

// Exportar desde guards.js
export { 
    default as Guards,
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
} from './guards.js';

// Hacer disponible globalmente para scripts que no son modules
// Esta parte es importante para que funcione en onclick y scripts inline
(function() {
    // Cuando el DOM esté listo, exponer las funciones globalmente
    document.addEventListener('DOMContentLoaded', async function() {
        const guards = await import('./guards.js');
        
        window.RoleSystem = {
            Roles: (await import('./constants.js')).default,
            hasRole: guards.hasRole,
            hasAnyRole: guards.hasAnyRole,
            getUserRole: guards.getUserRole,
            logout: guards.logout
        };
        
        // También exponer logout directamente para onclick
        window.logout = guards.logout;
        
        console.log('RoleSystem cargado correctamente');
    });
})();