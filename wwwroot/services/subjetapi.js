// excelApi.js - Versión sin export

const API_BASE_URL = "http://localhost:5074/api/excel-subject"

// Hacer ExcelApi global
window.SubjetApi = {


    ////////////////////////////////////////////////////////
    // 🔹 GENERAR EXCEL POR MATERIAS Y TEMAS
    ////////////////////////////////////////////////////////
    async generateExcelByTopics(data) {

        try {

            const response = await fetch(
                `${API_BASE_URL}/generate-by-topics`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "*/*"
                    },
                    body: JSON.stringify(data)
                }
            )

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`)
            }

            const result = await response.json()

            return result

        } catch (error) {

            console.error("Error generando Excel por temas:", error)
            throw error

        }
    },
    async getAll() {
        try {
            const response = await fetch(`${API_BASE_URL}/generated/All`);

            if (!response.ok) {
                throw new Error("Error al obtener los archivos");
            }

            return await response.json();

        } catch (error) {
            console.error("Error en getAll ExcelSubject:", error);
            return [];
        }
    },
  
    ////////////////////////////////////////////////////////
    // 🔹 ELIMINAR EXCEL POR ID
    ////////////////////////////////////////////////////////
    async deleteById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "*/*"
                }
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el archivo");
            }

            return true;

        } catch (error) {
            console.error("Error eliminando Excel:", error);
            throw error;
        }
    }


}


