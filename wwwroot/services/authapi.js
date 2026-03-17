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
            nombreCompleto: usuario.nombre
        };

        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify(usuarioAdaptado));
        localStorage.setItem("correo", usuario.correo);
        localStorage.setItem("cardibot_role", usuario.rol);

        return { token, usuario: usuarioAdaptado };

    } catch (error) {

        console.error("Error login:", error);
        throw "Error de conexión con el servidor";

    }
}