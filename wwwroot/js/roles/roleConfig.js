// wwwroot/js/roles/roleConfig.js
// Archivo central de configuración de permisos por rol

export const Roles = {
    ADMINISTRADOR: 'Administrador',
    DOCENTE: 'Docente',
    ALUMNO: 'Alumno',
    COORDINADOR: 'Coordinador',
    SOPORTE: 'Soporte'
};

// CONFIGURACIÓN DE PERMISOS - MODIFICA AQUÍ LOS ACCESOS
export const rolePermissions = {
    // Dashboard - ¿Quiénes pueden verlo?
    dashboard: {
        allowedRoles: [Roles.ADMINISTRADOR, Roles.COORDINADOR], // Solo Admin y Coordinador
        // allowedRoles: [Roles.ADMINISTRADOR], // Solo Admin
        // allowedRoles: [Roles.ADMINISTRADOR, Roles.DOCENTE, Roles.COORDINADOR], // Todos menos Estudiante
        icon: 'fa-chart-pie',
        text: 'Dashboard',
        href: '/Dashboard/Index'
    },
    
    // Guías PDF - ¿Quiénes pueden verlo?
    guias: {
        allowedRoles: [Roles.ADMINISTRADOR, Roles.DOCENTE, Roles.COORDINADOR,Roles.ALUMNO],
        // allowedRoles: [Roles.ADMINISTRADOR], // Solo Admin
        // allowedRoles: [], // Nadie (oculto)
        icon: 'fa-file-pdf',
        text: 'Guías PDF',
        href: '/Guia/Index'
    },
    
    // Reactivos - ¿Quiénes pueden verlo?
    reactivos: {
        allowedRoles: [Roles.ADMINISTRADOR, Roles.DOCENTE, Roles.ALUMNO],
        // allowedRoles: [Roles.ADMINISTRADOR], // Solo Admin
        icon: 'fa-flask',
        text: 'Generar Reactivos',
        href: '/Reactivos/Index'
    }
};

// Función helper para verificar si un rol tiene permiso para un módulo
export function tienePermiso(rol, modulo) {
    const moduloConfig = rolePermissions[modulo];
    return moduloConfig && moduloConfig.allowedRoles.includes(rol);
}

// Obtener todos los módulos que puede ver un rol
export function getModulosPorRol(rol) {
    return Object.entries(rolePermissions)
        .filter(([_, config]) => config.allowedRoles.includes(rol))
        .map(([key, config]) => ({
            key,
            ...config
        }));
}

// Colores por rol para el badge
export const roleColors = {
    [Roles.ADMINISTRADOR]: 'bg-red-600',
    [Roles.DOCENTE]: 'bg-green-600',
    [Roles.ESTUDIANTE]: 'bg-blue-600',
    [Roles.COORDINADOR]: 'bg-purple-600',
    [Roles.SOPORTE]: 'bg-yellow-600'
};

export default {
    Roles,
    rolePermissions,
    tienePermiso,
    getModulosPorRol,
    roleColors
};