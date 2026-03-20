// services/authapi.js
import { redirectBasedOnRole } from '../wwwroot/js/roles/index.js';

const API_URL = "https://www.uttt.edu.mx/AdministradoresCardibot/api/Auth";
const LOGIN_ENDPOINT = "/login";

export async function login(identificador, clave) {
    try {
        const response = await fetch(`${API_URL}${LOGIN_ENDPOINT}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                login: identificador,
                clave: clave
            })
        });

        if (!response.ok) {
            throw new Error("Credenciales incorrectas");
        }

        const data = await response.json();
        const { token, usuario } = data;

        const usuarioAdaptado = {
            ...usuario,
            nombreCompleto: usuario.nombre || usuario.nombreCompleto,
            id: usuario.id,
            email: usuario.correo || usuario.email
        };

        // Guardar en localStorage (usando SOLO "role" como clave)
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify(usuarioAdaptado));
        localStorage.setItem("correo", usuario.correo || usuario.email);
        localStorage.setItem("role", usuario.rol); // SOLO "role" como clave

        console.log("Login exitoso - Rol:", usuario.rol); // Para debugging

        // Redirigir según el rol
        redirectBasedOnRole();
        
        return { token, usuario: usuarioAdaptado };

    } catch (error) {
        console.error("Error login:", error);
        throw error.message || "Error de conexión con el servidor";
    }
}

// Función para verificar el estado de autenticación
export function checkAuth() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Usando "role"
    
    if (!token) {
        return { isAuthenticated: false };
    }
    
    return {
        isAuthenticated: true,
        token,
        role,
        usuario: JSON.parse(localStorage.getItem('usuario') || '{}')
    };
}