
    
    
const PdfApi = {

    // URL base de la API
    baseUrl: 'http://localhost:5074/api',

    

    
    
    // ===============================
    // SUBIR ARCHIVO PDF
    // ===============================
    async uploadPdfFile(file) {

        try {

            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${this.baseUrl}/pdf-files/examples/pdf`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            return {
                success: true,
                id: data.id
            };

        } catch (error) {

            console.error('Error en API:', error);

            return {
                success: false,
                error: error.message
            };
        }
    },



    // ===============================
    // OBTENER TODOS LOS ARCHIVOS
    // ===============================
    async getFiles() {

        try {

            const response = await fetch(`${this.baseUrl}/pdf-files`, {
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

            console.error('Error al obtener archivos:', error);

            return {
                success: false,
                error: error.message
            };
        }
    },
    // ===============================
    // ELIMINAR ARCHIVO
    // ===============================
    async deleteFile(id) {

        try {

            const response = await fetch(`${this.baseUrl}/pdf-files/${id}`, {
                method: 'DELETE',
                headers: {
                    'accept': '*/*'
                }
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            return {
                success: true
            };

        } catch (error) {

            console.error('Error al eliminar archivo:', error);

            return {
                success: false,
                error: error.message
            };
        }
    },

    // ===============================
    // DESCARGAR ARCHIVO POR ID
    // ===============================
    async downloadFileById(id) {

        try {

            const response = await fetch(`${this.baseUrl}/pdf-files/${id}`);

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');

            a.href = url;
            a.download = `archivo-${id}.pdf`;

            document.body.appendChild(a);

            a.click();

            a.remove();

            return {
                success: true
            };

        } catch (error) {

            console.error('Error al descargar archivo:', error);

            return {
                success: false,
                error: error.message
            };
        }
    },
};


    window.PdfApi = PdfApi;