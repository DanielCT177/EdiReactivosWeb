// ============================================
// FUNCIONES UTILITARIAS
// ============================================

// Formatear tamaño de archivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Formatear fecha
function formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ============================================
// FUNCIONES PARA TOAST
// ============================================
function showToast(message, type = 'success') {
    let toast = document.getElementById('toastNotification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastNotification';
        document.body.appendChild(toast);
    }
    
    const bgColor = type === 'success' ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600';
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    
    toast.className = `fixed bottom-4 right-4 bg-gradient-to-r ${bgColor} text-white px-6 py-3 rounded-xl shadow-lg transform transition-all duration-300 translate-y-20 opacity-0 z-50 flex items-center gap-3`;
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
    
    setTimeout(() => {
        toast.classList.remove('translate-y-20', 'opacity-0');
    }, 100);
    
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// ============================================
// FUNCIONES PARA MODAL DE ERROR
// ============================================
function showErrorModal(title, detail) {
    document.getElementById('errorMessage').textContent = title || 'Error';
    document.getElementById('errorDetail').textContent = detail || 'Ha ocurrido un error inesperado';
    document.getElementById('errorModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeErrorModal() {
    document.getElementById('errorModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// ============================================
// CERRAR MODALES CON CLICK FUERA Y TECLA ESC
// ============================================
window.addEventListener('click', (e) => {
    const modals = ['deleteConfirmModal', 'errorModal', 'pdfModal', 'wordModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (e.target === modal) {
            if (modalId === 'deleteConfirmModal') closeDeleteModal();
            if (modalId === 'errorModal') closeErrorModal();
            if (modalId === 'pdfModal') closePdfModal();
            if (modalId === 'wordModal') closeWordModal();
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDeleteModal();
        closeErrorModal();
        closePdfModal();
        closeWordModal();
    }
});