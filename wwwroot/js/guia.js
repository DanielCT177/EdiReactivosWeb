// guia.js - Solo funcionalidad de subida de PDF

$(document).ready(function () {
    // Elementos del DOM
    const uploadArea = $('#uploadArea');
    const fileInput = $('#fileInput');
    const uploadBtn = $('#uploadBtn');
    const uploadProgress = $('#uploadProgress');
    const progressBar = $('#progressBar');
    const progressPercent = $('#progressPercent');

    // ========== FUNCIÓN PARA MOSTRAR NOTIFICACIONES ==========
    function showToast(message, type = 'success') {
        const toast = $(`
            <div class="toast-message toast-${type}">
                <i class="bi ${type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-circle-fill text-danger'}"></i>
                <span>${message}</span>
            </div>
        `);

        $('body').append(toast);

        setTimeout(() => {
            toast.fadeOut(300, function () {
                $(this).remove();
            });
        }, 3000);
    }

    // ========== FUNCIÓN PARA SUBIR ARCHIVO A LA API ==========
    async function uploadFileToAPI(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5074/api/files/examples/pdf', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const result = await response.json();
            return { success: true, data: result };
        } catch (error) {
            console.error('Error al subir archivo:', error);
            return { success: false, error: error.message };
        }
    }

    // ========== FUNCIÓN PARA MANEJAR LA SUBIDA ==========
    async function handleFileUpload(file) {
        // Validaciones
        if (file.type !== 'application/pdf') {
            showToast('Solo se permiten archivos PDF', 'error');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showToast('El archivo no puede ser mayor a 10MB', 'error');
            return;
        }

        // Mostrar progreso y deshabilitar botón
        uploadProgress.show();
        uploadBtn.prop('disabled', true);

        // Simular progreso (opcional, ya que fetch no da progreso nativo)
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress <= 90) {
                progressBar.css('width', progress + '%');
                progressPercent.text(progress + '%');
            }
        }, 200);

        // Subir archivo
        const result = await uploadFileToAPI(file);

        // Limpiar intervalo y ocultar progreso
        clearInterval(interval);
        uploadProgress.hide();
        uploadBtn.prop('disabled', false);
        progressBar.css('width', '0%');
        progressPercent.text('0%');

        // Mostrar resultado
        if (result.success) {
            showToast('✅ Archivo subido correctamente', 'success');
            fileInput.val(''); // Limpiar input
        } else {
            showToast(`❌ Error: ${result.error}`, 'error');
        }
    }

    // ========== EVENTOS ==========

    // Click en el área de subida
    uploadArea.on('click', function () {
        fileInput.click();
    });

    // Drag & drop
    uploadArea.on('dragover', function (e) {
        e.preventDefault();
        $(this).addClass('dragover');
    });

    uploadArea.on('dragleave', function () {
        $(this).removeClass('dragover');
    });

    uploadArea.on('drop', function (e) {
        e.preventDefault();
        $(this).removeClass('dragover');

        const files = e.originalEvent.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });

    // Selección de archivo
    fileInput.on('change', function () {
        if (this.files.length > 0) {
            handleFileUpload(this.files[0]);
        }
    });

    // Botón de subida manual (opcional)
    uploadBtn.on('click', function () {
        fileInput.click();
    });

    // Mensaje de bienvenida
    console.log('📄 Módulo de subida de PDF listo');
});