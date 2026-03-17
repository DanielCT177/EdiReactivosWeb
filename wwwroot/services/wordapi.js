// apiService.js - Servicio para llamadas a la API

const WordApi = {

    // URL base de la API
    baseUrl: 'http://localhost:5074/api',

    



    // ===============================
    // PROCESAR PDF CON IA
    // ===============================
    async parsePdfWithAI(id) {

        try {

            const response = await fetch(`${this.baseUrl}/word-files/examples/${id}/parse-ai`, {
                method: 'POST',
                headers: {
                    'accept': '*/*'
                },
                body: ''
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            return {
                success: true,
                data: data
            };

        } catch (error) {

            console.error('Error al procesar PDF con IA:', error);

            return {
                success: false,
                error: error.message
            };
        }
    },


    // ============================================
    // MODIFICAR: generateFromAiStructure
    // ============================================
    async generateFromAiStructure(parsedGuide, sourcePdfId = null, sourcePdfName = null) {
        try {
            // Construir URL con query parameters
            let url = `${this.baseUrl}/word-files/generate-from-ai-structure`;
            const params = new URLSearchParams();

            if (sourcePdfId) {
                params.append('sourcePdfId', sourcePdfId);
            }
            if (sourcePdfName) {
                params.append('sourcePdfName', sourcePdfName);
            }

            if (params.toString()) {
                url += '?' + params.toString();
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*'
                },
                body: JSON.stringify(parsedGuide)
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            return {
                success: true,
                data: data
            };

        } catch (error) {
            console.error('Error al generar desde estructura IA:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // ===============================
    // OBTENER ARCHIVOS word GENERADOS
    // ===============================
    async getGeneratedFiles() {

        try {

            const response = await fetch(`${this.baseUrl}/word-files/generated/All`, {
                method: 'GET',
                headers: {
                    'accept': '*/*'
                }
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            return {
                success: true,
                files: data
            };

        } catch (error) {

            console.error('Error al obtener archivos generados:', error);

            return {
                success: false,
                error: error.message
            };
        }
    },


    // ===============================
// ELIMINAR ARCHIVO WORD GENERADO
// ===============================
async deleteGeneratedFile(fileId) {
    try {
        console.log(`🗑️ Eliminando archivo Word generado: ${fileId}`);
        
        const response = await fetch(`${this.baseUrl}/word-files/generated/${fileId}`, {
            method: 'DELETE',
            headers: {
                'accept': '*/*'
            }
        });

        if (!response.ok) {
            let errorMessage = `Error HTTP: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.title || errorMessage;
            } catch {
                // Si no se puede parsear JSON, usar el mensaje por defecto
            }
            throw new Error(errorMessage);
        }

        // Para DELETE, algunas APIs devuelven 204 No Content
        if (response.status === 204) {
            return {
                success: true,
                message: 'Archivo eliminado correctamente'
            };
        }

        // Si hay cuerpo en la respuesta, lo procesamos
        const data = await response.json().catch(() => null);
        
        return {
            success: true,
            data: data,
            message: 'Archivo eliminado correctamente'
        };

    } catch (error) {
        console.error('❌ Error al eliminar archivo Word generado:', error);
        
        return {
            success: false,
            error: error.message
        };
    }
},

};



// Exportar para uso global
window.WordApi = WordApi;