// wwwroot/js/roles/constants.js
export const Roles = {
    ADMINISTRADOR: 'Administrador',
    DOCENTE: 'Docente',
    ALUMNO: 'Alumno',
    COORDINADOR: 'Coordinador',
    SOPORTE: 'Soporte'
};

export const RoleColors = {
    [Roles.ADMINISTRADOR]: 'bg-red-600',
    [Roles.DOCENTE]: 'bg-green-600',
    [Roles.ALUMNO]: 'bg-blue-600',
    [Roles.COORDINADOR]: 'bg-purple-600',
    [Roles.SOPORTE]: 'bg-yellow-600'
};

export const RoleIcons = {
    [Roles.ADMINISTRADOR]: 'fa-user-tie',
    [Roles.DOCENTE]: 'fa-chalkboard-user',
    [Roles.ALUMNO]: 'fa-user-graduate',
    [Roles.COORDINADOR]: 'fa-users-between-lines',
    [Roles.SOPORTE]: 'fa-headset'
};

export default Roles;