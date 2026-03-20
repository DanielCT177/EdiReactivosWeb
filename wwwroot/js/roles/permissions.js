// wwwroot/js/roles/permissions.js
import { Roles } from './constants.js';

// Definición de permisos por rol
export const Permissions = {
    [Roles.ADMINISTRADOR]: [
        'ver_todo',
        'crear_usuario',
        'editar_usuario',
        'eliminar_usuario',
        'ver_reportes',
        'exportar_datos',
        'configurar_sistema',
        'ver_logs',
        'gestionar_roles'
    ],
    
    [Roles.COORDINADOR]: [
        'ver_reportes',
        'gestionar_docentes',
        'ver_estadisticas',
        'crear_cursos',
        'asignar_docentes',
        'ver_horarios'
    ],
    
    [Roles.DOCENTE]: [
        'ver_cursos_asignados',
        'calificar_estudiantes',
        'tomar_asistencia',
        'subir_material',
        'ver_estudiantes',
        'crear_tareas'
    ],
    
    [Roles.ESTUDIANTE]: [
        'ver_materias_inscritas',
        'ver_calificaciones',
        'ver_horario',
        'entregar_tareas',
        'ver_material'
    ],
    
    [Roles.SOPORTE]: [
        'ver_incidencias',
        'resolver_incidencias',
        'ver_estado_sistema',
        'ayuda_usuarios',
        'ver_logs_error'
    ]
};

// Función para verificar permisos
export function hasPermission(rol, permiso) {
    return Permissions[rol]?.includes(permiso) || false;
}

// Función para obtener todos los permisos de un rol
export function getPermissionsByRole(rol) {
    return Permissions[rol] || [];
}

export default Permissions;