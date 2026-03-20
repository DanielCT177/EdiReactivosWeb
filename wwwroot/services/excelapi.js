// excelApi.js - Versión sin export

const API_BASE_URL = "http://localhost:5074/api/excel-files"

// Hacer ExcelApi global
window.ExcelApi = {

    ////////////////////////////////////////////////////////
    // 🔹 OBTENER CONTENIDO TEMÁTICO
    ////////////////////////////////////////////////////////
    async getContenidoTematico(fileId) {

        try {

            const response = await fetch(
                `${API_BASE_URL}/${fileId}/contenido-tematico`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "*/*"
                    }
                }
            )

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`)
            }

            const data = await response.json()

            return data

        } catch (error) {

            console.error("Error obteniendo contenido temático:", error)
            throw error

        }
    },

    ////////////////////////////////////////////////////////
    // 🔹 GENERAR REACTIVOS DESDE CONTENIDO TEMÁTICO
    ////////////////////////////////////////////////////////
    async generateExcelReactivos(contenidoTematico) {

        try {

            const response = await fetch(
                `${API_BASE_URL}/generate-excel-reactivos`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "*/*"
                    },
                    body: JSON.stringify(contenidoTematico)
                }
            )

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`)
            }

            const result = await response.json()

            return result

        } catch (error) {

            console.error("Error generando reactivos:", error)
            throw error

        }
    },

    ////////////////////////////////////////////////////////
    // 🔹 GENERAR ARCHIVO EXCEL FINAL
    ////////////////////////////////////////////////////////
    async generateExcel(materias, wordId, wordName) {

        try {

            const response = await fetch(
                `${API_BASE_URL}/generate-excel?sourceWordId=${wordId}&sourceWordName=${encodeURIComponent(wordName)}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "*/*"
                    },
                    body: JSON.stringify(materias)
                }
            )

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`)
            }

            const result = await response.json()

            return result

        } catch (error) {

            console.error("Error generando Excel:", error)
            throw error

        }
    },
    ////////////////////////////////////////////////////////
    // 🔹 DESCARGAR EXCEL
    ////////////////////////////////////////////////////////
    async downloadExcel(fileId, fileName) {

    const response = await fetch(`${API_BASE_URL}/excel/${fileId}`);

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    // 🔥 NOMBRE REAL DEL EXCEL
    a.download = fileName || `${fileId}.xlsx`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    },

    ////////////////////////////////////////////////////////
    // 🔹 OBTENER TODOS LOS EXCEL GENERADOS
    ////////////////////////////////////////////////////////
    async getAllGeneratedExcel() {

        try {

            const response = await fetch(
                `${API_BASE_URL}/generated/All`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "*/*"
                    }
                }
            )

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`)
            }

            const data = await response.json()

            return data

        } catch (error) {

            console.error("Error obteniendo archivos generados:", error)
            throw error

        }
    },

    ////////////////////////////////////////////////////////
    // 🔹 ELIMINAR ARCHIVO GENERADO
    ////////////////////////////////////////////////////////
    async deleteGeneratedExcel(fileId) {

        try {

            const response = await fetch(
                `${API_BASE_URL}/generated/${fileId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Accept": "*/*"
                    }
                }
            )

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`)
            }

            return true

        } catch (error) {

            console.error("Error eliminando archivo generado:", error)
            throw error

        }
    },



}


