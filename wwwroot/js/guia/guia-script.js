    // ============================================
        // VARIABLES GLOBALES
        // ============================================
        let allFiles = []; // Archivos PDF
        let allWordFiles = []; // Archivos Word generados
        let pdfFilesMap = {}; // Mapa para relacionar PDFs por ID
        let filteredFiles = [];
        let filteredWordFiles = [];
        let currentPage = 1;
        let currentWordPage = 1;
        let itemsPerPage = 5;
        let currentFileId = null;
        let currentFileName = '';
        let pendingDeleteId = null;
        let pendingDeleteType = 'pdf'; // 'pdf', 'word' o 'excel'

        // ============================================
        // VARIABLES GLOBALES PARA EXCEL
        // ============================================
        let allExcelFiles = []; // Archivos Excel generados
        let filteredExcelFiles = [];
        let currentExcelPage = 1;
        let itemsPerPageExcel = 5;

        // ============================================
        // VARIABLES GLOBALES PARA SPINNER CON PROGRESO
        // ============================================
        let activeProcesses = 0;

        // ============================================
        // FUNCIONES PARA SPINNER CON PROGRESO (NUEVO DISEÑO)
 
function showProgressSpinner(message = 'Procesando...') {
    activeProcesses++;

    let spinner = document.getElementById('globalSpinner');
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.id = 'globalSpinner';
        spinner.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center transition-opacity duration-300';
        spinner.innerHTML = `
            <div class="bg-white p-8 rounded-2xl shadow-2xl text-center transform scale-95 transition-all duration-300 max-w-md w-full mx-4" id="spinnerContent">
                <div class="loading-spinner-large w-20 h-20 mx-auto mb-6" style="border-top-color: #2563eb; border-width: 4px;"></div>
                <div class="mb-4">
                    <span class="text-4xl font-bold text-gray-800" id="progressPercentage">0%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
                    <div class="bg-gradient-to-r from-[#00002c] to-[#1a1a5c] h-3 rounded-full transition-all duration-300" id="spinnerProgressBar" style="width: 0%"></div>
                </div>
                <p class="text-gray-700 font-medium text-lg mb-2" id="spinnerMessage">${message}</p>
                <p class="text-gray-500 text-sm" id="spinnerSubmessage"></p>
                <div class="mt-6 flex justify-center gap-2">
                    <i class="fa-solid fa-circle text-blue-600 text-xs animate-pulse"></i>
                    <i class="fa-solid fa-circle text-indigo-600 text-xs animate-pulse" style="animation-delay: 0.2s"></i>
                    <i class="fa-solid fa-circle text-purple-600 text-xs animate-pulse" style="animation-delay: 0.4s"></i>
                </div>
            </div>
        `;
        document.body.appendChild(spinner);

        setTimeout(() => {
            document.getElementById('spinnerContent').classList.remove('scale-95');
            document.getElementById('spinnerContent').classList.add('scale-100');
        }, 50);
    } else {
        document.getElementById('spinnerMessage').textContent = message;
        document.getElementById('spinnerSubmessage').textContent = '';
        resetProgress();
        spinner.classList.remove('hidden');

        const content = document.getElementById('spinnerContent');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        setTimeout(() => {
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }, 50);
    }

    document.body.style.overflow = 'hidden';
}

function updateProgress(percentage, message = null, submessage = null) {
    percentage = Math.min(100, Math.max(0, percentage));

    // ✅ USAR spinnerProgressBar en lugar de progressBar
    const progressBar = document.getElementById('spinnerProgressBar');
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        console.log(`Barra del spinner actualizada: ${percentage}%`); // Para debug
    } else {
        console.warn('spinnerProgressBar no encontrado');
    }

    const percentText = document.getElementById('progressPercentage');
    if (percentText) {
        percentText.textContent = `${Math.round(percentage)}%`;
    }

    if (message) {
        const msgEl = document.getElementById('spinnerMessage');
        if (msgEl) msgEl.textContent = message;
    }

    if (submessage) {
        const subEl = document.getElementById('spinnerSubmessage');
        if (subEl) subEl.textContent = submessage;
    }
}

function resetProgress() {
    updateProgress(0);
}

function hideProgressSpinner() {
    activeProcesses = Math.max(0, activeProcesses - 1);

    if (activeProcesses === 0) {
        const spinner = document.getElementById('globalSpinner');
        if (spinner) {
            const content = document.getElementById('spinnerContent');
            if (content) {
                content.classList.remove('scale-100');
                content.classList.add('scale-95');
            }

            setTimeout(() => {
                spinner.classList.add('hidden');
                document.body.style.overflow = 'auto';
                resetProgress();
            }, 200);
        }
    }
}

        // ============================================
        // FUNCIONES PARA EL MODAL PDF
        // ============================================
        function openPdfModal(fileId, fileName) {
            currentFileId = fileId;
            currentFileName = fileName;

            const pdfUrl = `${PdfApi.baseUrl}/pdf-files/${fileId}`;

            document.getElementById('modalFileName').textContent = fileName;
            document.getElementById('pdfViewer').src = pdfUrl;
            document.getElementById('pdfModal').classList.remove('hidden');

            // Animación de entrada
            setTimeout(() => {
                document.getElementById('pdfModalContent').classList.remove('scale-95');
                document.getElementById('pdfModalContent').classList.add('scale-100');
            }, 10);

            document.body.style.overflow = 'hidden';
        }

        function closePdfModal() {
            document.getElementById('pdfModalContent').classList.remove('scale-100');
            document.getElementById('pdfModalContent').classList.add('scale-95');

            setTimeout(() => {
                document.getElementById('pdfModal').classList.add('hidden');
                document.getElementById('pdfViewer').src = '';
                document.body.style.overflow = 'auto';
            }, 200);
        }

        // ============================================
        // FUNCIONES PARA EL MODAL WORD
        // ============================================
        function openWordModal(fileName, fileId) {
            document.getElementById('wordModalFileName').textContent = fileName || 'Documento Word';

            // Aquí podrías cargar una vista previa si está disponible
            // Por ahora mostramos el mensaje de vista previa no disponible

            document.getElementById('wordModal').classList.remove('hidden');

            setTimeout(() => {
                document.getElementById('wordModalContent').classList.remove('scale-95');
                document.getElementById('wordModalContent').classList.add('scale-100');
            }, 10);

            document.body.style.overflow = 'hidden';
        }

        function closeWordModal() {
            document.getElementById('wordModalContent').classList.remove('scale-100');
            document.getElementById('wordModalContent').classList.add('scale-95');

            setTimeout(() => {
                document.getElementById('wordModal').classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 200);
        }

        // ============================================
        // FUNCIONES PARA MODAL DE ELIMINACIÓN
        // ============================================
        function showDeleteModal(id, fileName) {
            pendingDeleteId = id;
            pendingDeleteType = 'pdf';
            document.getElementById('deleteFileName').textContent = fileName || 'Documento seleccionado';
            document.getElementById('deleteModalMessage').textContent = 'Esta acción no se puede deshacer y el archivo PDF se perderá permanentemente.';
            document.getElementById('deleteConfirmModal').classList.remove('hidden');

            // Animación de entrada y vibración
            setTimeout(() => {
                document.getElementById('deleteModalContent').classList.remove('scale-95');
                document.getElementById('deleteModalContent').classList.add('scale-100');

                // Agregar clase de vibración al header
                const header = document.querySelector('#deleteConfirmModal .shake-animation');
                header.classList.remove('shake-animation');
                void header.offsetWidth; // Reiniciar animación
                header.classList.add('shake-animation');
            }, 10);

            document.body.style.overflow = 'hidden';
        }

        function showDeleteWordModal(id, fileName) {
            pendingDeleteId = id;
            pendingDeleteType = 'word';
            document.getElementById('deleteFileName').textContent = fileName || 'Documento seleccionado';
            document.getElementById('deleteModalMessage').textContent = 'Esta acción no se puede deshacer y el documento Word generado se perderá permanentemente.';
            document.getElementById('deleteConfirmModal').classList.remove('hidden');

            setTimeout(() => {
                document.getElementById('deleteModalContent').classList.remove('scale-95');
                document.getElementById('deleteModalContent').classList.add('scale-100');

                const header = document.querySelector('#deleteConfirmModal .shake-animation');
                header.classList.remove('shake-animation');
                void header.offsetWidth;
                header.classList.add('shake-animation');
            }, 10);

            document.body.style.overflow = 'hidden';
        }

        function showDeleteExcelModal(id, fileName) {
            pendingDeleteId = id;
            pendingDeleteType = 'excel';
            document.getElementById('deleteFileName').textContent = fileName || 'Documento Excel';
            document.getElementById('deleteModalMessage').textContent = 'Esta acción no se puede deshacer y el archivo Excel se perderá permanentemente.';
            document.getElementById('deleteConfirmModal').classList.remove('hidden');

            setTimeout(() => {
                document.getElementById('deleteModalContent').classList.remove('scale-95');
                document.getElementById('deleteModalContent').classList.add('scale-100');

                const header = document.querySelector('#deleteConfirmModal .shake-animation');
                header.classList.remove('shake-animation');
                void header.offsetWidth;
                header.classList.add('shake-animation');
            }, 10);

            document.body.style.overflow = 'hidden';
        }

        function closeDeleteModal() {
            document.getElementById('deleteModalContent').classList.remove('scale-100');
            document.getElementById('deleteModalContent').classList.add('scale-95');

            setTimeout(() => {
                document.getElementById('deleteConfirmModal').classList.add('hidden');
                document.body.style.overflow = 'auto';
                // NO limpiar pendingDeleteId aquí
            }, 200);
        }

        // ============================================
        // FUNCIÓN PARA TOAST
        // ============================================
        function showToast(message, type = 'success') {
            let toast = document.getElementById('toastNotification');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'toastNotification';
                document.body.appendChild(toast);
            }

            if (type === 'success') {
                toast.className = 'fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg transform transition-all duration-300 translate-y-20 opacity-0 z-50 flex items-center gap-3';
                toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + message;
            } else {
                toast.className = 'fixed bottom-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl shadow-lg transform transition-all duration-300 translate-y-20 opacity-0 z-50 flex items-center gap-3';
                toast.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> ' + message;
            }

            setTimeout(() => {
                toast.classList.remove('translate-y-20', 'opacity-0');
            }, 100);

            setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 3000);
        }

   

        // ============================================
        // CARGAR ARCHIVOS AL INICIAR
        // ============================================
        document.addEventListener('DOMContentLoaded', async function () {
            await loadFiles();
            await loadWordDocuments();
            await loadExcelFiles(true); // Mostrar loading en la carga inicial
            updateHeaderStats();
        });

        // ============================================
        // FUNCIÓN PARA CARGAR ARCHIVOS PDF
        // ============================================
    // ============================================
// FUNCIÓN PARA CARGAR ARCHIVOS PDF (CON MISMA ESTRUCTURA QUE EXCEL)
// ============================================
async function loadFiles(showLoading = true) {
    try {
        const tbody = document.getElementById('filesTableBody');
        
        // Solo mostrar loading si se solicita explícitamente
        if (showLoading) {
            tbody.innerHTML = `
                <tr id="loadingRow">
                    <td colspan="5" class="px-6 py-8 text-center">
                        <div class="flex flex-col items-center justify-center">
                            <i class="fa-solid fa-spinner fa-spin text-[#00002c] text-3xl mb-3"></i>
                            <p class="text-gray-500">Cargando documentos PDF...</p>
                        </div>
                    </td>
                </tr>
            `;
        }

        const result = await PdfApi.getFiles();

        if (result && result.success) {
            allFiles = result.files || [];

            // Crear un mapa de PDFs por ID para referencia rápida
            pdfFilesMap = {};
            allFiles.forEach(file => {
                if (file.id) {
                    pdfFilesMap[file.id] = file;
                }
            });

            // Aplicar filtro de búsqueda si existe
            const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
            if (searchTerm) {
                filteredFiles = allFiles.filter(file => {
                    const fileName = (file.originalName || file.path || '').toLowerCase();
                    return fileName.includes(searchTerm) || (file.id && file.id.includes(searchTerm));
                });
            } else {
                filteredFiles = [...allFiles];
            }

            renderTable();
            updatePDFStats();
        } else {
            console.error('Error en respuesta PDF:', result?.error);
            if (showLoading) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center">
                                <i class="fa-solid fa-file-pdf text-gray-300 text-5xl mb-4"></i>
                                <p class="text-gray-500 text-lg">Error al cargar archivos PDF</p>
                                <p class="text-gray-400 text-sm mt-1">${result?.error || 'Error desconocido'}</p>
                            </div>
                        </td>
                    </tr>
                `;
            }
        }
    } catch (error) {
        console.error('Error cargando PDF:', error);
        if (showLoading) {
            document.getElementById('filesTableBody').innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-12 text-center">
                        <div class="flex flex-col items-center">
                            <i class="fa-solid fa-file-pdf text-gray-300 text-5xl mb-4"></i>
                            <p class="text-gray-500 text-lg">Error al cargar archivos PDF</p>
                            <p class="text-gray-400 text-sm mt-1">${error.message}</p>
                        </div>
                    </td>
                </tr>
            `;
        }
    }
}

        // ============================================
        // FUNCIÓN HELPER PARA MANEJAR LOADING DE FORMA SEGURA
        // ============================================
        function setWordLoading(show) {
            const loadingRow = document.getElementById('loadingWordRow');
            if (loadingRow) {
                loadingRow.style.display = show ? '' : 'none';
            } else if (show) {
                // Si no existe y queremos mostrarlo, lo creamos
                createLoadingRow();
            }
        }

        // ============================================
        // FUNCIÓN PARA CREAR LOADING ROW SI NO EXISTE
        // ============================================
        function createLoadingRow() {
            const tbody = document.getElementById('wordFilesTableBody');
            if (!tbody) return;

            // Verificar si ya existe
            if (document.getElementById('loadingWordRow')) return;

            const loadingRow = document.createElement('tr');
            loadingRow.id = 'loadingWordRow';
            loadingRow.innerHTML = `
                <td colspan="5" class="px-6 py-8 text-center">
                    <div class="flex flex-col items-center justify-center">
                        <i class="fa-solid fa-spinner fa-spin text-blue-600 text-3xl mb-3"></i>
                        <p class="text-gray-500">Cargando documentos Word generados...</p>
                    </div>
                </td>
            `;
            tbody.appendChild(loadingRow);
        }

        // ============================================
        // FUNCIÓN PARA CARGAR DOCUMENTOS WORD
        // ============================================
 // ============================================
// FUNCIÓN PARA CARGAR DOCUMENTOS WORD (CON MISMA ESTRUCTURA QUE EXCEL)
// ============================================
async function loadWordDocuments(showLoading = true) {
    try {
        const tbody = document.getElementById('wordFilesTableBody');
        
        // Solo mostrar loading si se solicita explícitamente
        if (showLoading) {
            tbody.innerHTML = `
                <tr id="loadingWordRow">
                    <td colspan="5" class="px-6 py-8 text-center">
                        <div class="flex flex-col items-center justify-center">
                            <i class="fa-solid fa-spinner fa-spin text-blue-600 text-3xl mb-3"></i>
                            <p class="text-gray-500">Cargando documentos Word generados...</p>
                        </div>
                    </td>
                </tr>
            `;
        }

        const result = await WordApi.getGeneratedFiles();

        if (result && result.success) {
            allWordFiles = result.files || [];
            console.log("📄 Documentos Word generados:", allWordFiles);

            // Asegurar que tenemos los PDFs cargados para referencias
            if (allFiles.length === 0) {
                await loadFiles(false); // Cargar PDFs sin mostrar loading
            }

            // Aplicar filtro de búsqueda si existe
            const searchTerm = document.getElementById('searchWordInput')?.value.toLowerCase() || '';
            if (searchTerm) {
                filteredWordFiles = allWordFiles.filter(file => {
                    const fileName = (file.originalName || '').toLowerCase();
                    const sourceName = (file.sourcePdfName || '').toLowerCase();
                    return fileName.includes(searchTerm) || sourceName.includes(searchTerm);
                });
            } else {
                filteredWordFiles = [...allWordFiles];
            }

            renderWordTable();
            updateWordStats();
        } else {
            console.error('Error en respuesta Word:', result?.error);
            if (showLoading) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center">
                                <i class="fa-solid fa-file-word text-gray-300 text-5xl mb-4"></i>
                                <p class="text-gray-500 text-lg">Error al cargar documentos Word</p>
                                <p class="text-gray-400 text-sm mt-1">${result?.error || 'Error desconocido'}</p>
                            </div>
                        </td>
                    </tr>
                `;
            }
        }
    } catch (error) {
        console.error('Error cargando Word:', error);
        if (showLoading) {
            document.getElementById('wordFilesTableBody').innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-12 text-center">
                        <div class="flex flex-col items-center">
                            <i class="fa-solid fa-file-word text-gray-300 text-5xl mb-4"></i>
                            <p class="text-gray-500 text-lg">Error al cargar documentos Word</p>
                            <p class="text-gray-400 text-sm mt-1">${error.message}</p>
                        </div>
                    </td>
                </tr>
            `;
        }
    }
}

        // ============================================
        // FUNCIÓN MEJORADA PARA OBTENER INFO DEL PDF ORIGEN
        // ============================================
        function getSourcePdfInfo(wordFile) {
            // Ahora el API debería devolver SourcePdfId y SourcePdfName
            const sourcePdfId = wordFile.sourcePdfId;
            const sourcePdfName = wordFile.sourcePdfName;

            if (sourcePdfId && sourcePdfName) {
                // Verificar si el PDF aún existe en la tabla de PDFs
                const pdfExists = pdfFilesMap[sourcePdfId] ? true : false;

                return {
                    id: sourcePdfId,
                    name: sourcePdfName,
                    exists: pdfExists
                };
            }

            return {
                name: 'No disponible',
                id: null,
                exists: false
            };
        }

        // ============================================
        // RENDERIZAR TABLA PDF
        // ============================================
        function renderTable() {
            const tbody = document.getElementById('filesTableBody');
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const pageFiles = filteredFiles.slice(start, end);

            if (filteredFiles.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center">
                                <i class="fa-solid fa-folder-open text-gray-300 text-5xl mb-4"></i>
                                <p class="text-gray-500 text-lg">No hay documentos PDF</p>
                                <p class="text-gray-400 text-sm mt-1">Sube tu primer PDF usando el formulario de arriba</p>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }

            let html = '';
            pageFiles.forEach(file => {
                if (!file.id) {
                    console.error('Archivo sin ID:', file);
                    return;
                }

                const fileId = file.id;
                const fileName = file.originalName || (file.path ? file.path.split('/').pop() : 'Sin nombre');

                const uploadDate = file.uploadDate ? new Date(file.uploadDate) : new Date();
                const formattedDate = uploadDate.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                html += `
                    <tr class="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all group">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i class="fa-solid fa-file-pdf text-red-500 text-lg"></i>
                                </div>
                                <span class="font-medium text-gray-800">${fileName}</span>
                            </div>
                        </td>
                       
                        <td class="px-6 py-4 text-gray-600">${formattedDate}</td>
                        <td class="px-6 py-4">
                            <span class="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-mono">${fileId.substring(0, 8)}...</span>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex gap-2">
                                <button onclick="openPdfModal('${fileId}', '${fileName}')" class="w-9 h-9 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all" title="Ver PDF">
                                    <i class="fa-solid fa-eye"></i>
                                </button>
                                
                                <button onclick="downloadFile('${fileId}', '${fileName}')" class="w-9 h-9 rounded-xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all" title="Descargar">
                                    <i class="fa-solid fa-download"></i>
                                </button>
                                <button onclick="generateWordFromPdf('${fileId}')" 
                                    class="w-9 h-9 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all" 
                                    title="Generar Word con IA">
                                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                                </button>
                                
                                <button onclick="showDeleteModal('${fileId}', '${fileName}')" class="w-9 h-9 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Eliminar">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });

            tbody.innerHTML = html;
            document.getElementById('loadingRow')?.remove();
            updatePagination();
            updatePDFStats();
        }

        // ============================================
        // RENDERIZAR TABLA WORD
        // ============================================
        function renderWordTable() {
            const tbody = document.getElementById('wordFilesTableBody');
            const start = (currentWordPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const pageFiles = filteredWordFiles.slice(start, end);

            // Ocultar loading
            document.getElementById('loadingWordRow').style.display = 'none';

            if (filteredWordFiles.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center">
                                <i class="fa-solid fa-file-word text-gray-300 text-5xl mb-4"></i>
                                <p class="text-gray-500 text-lg">No hay documentos Word generados</p>
                                <p class="text-gray-400 text-sm mt-1">Genera tu primer documento Word desde un PDF usando el botón <i class="fa-solid fa-wand-magic-sparkles text-purple-500"></i></p>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }

            let html = '';
            pageFiles.forEach(file => {
                if (!file.id) {
                    console.error('Archivo Word sin ID:', file);
                    return;
                }

                const fileId = file.id;
                const fileName = file.originalName || 'Sin nombre';

                const uploadDate = file.uploadDate ? new Date(file.uploadDate) : new Date();
                const formattedDate = uploadDate.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                // Obtener información del PDF origen usando la función mejorada
                const sourceInfo = getSourcePdfInfo(file);

                let sourcePdfHtml = '';
                if (sourceInfo.id && sourceInfo.exists) {
                    // El PDF existe - mostramos enlace
                    sourcePdfHtml = `
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-file-pdf text-red-500 text-sm"></i>
                            <button onclick="openPdfModal('${sourceInfo.id}', '${sourceInfo.name}')" 
                                class="text-sm text-blue-600 hover:underline truncate max-w-[150px]"
                                title="Ver PDF original">
                                ${sourceInfo.name}
                            </button>
                        </div>
                    `;
                } else if (sourceInfo.id) {
                    // El PDF fue eliminado
                    sourcePdfHtml = `
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-file-pdf text-gray-300 text-sm"></i>
                            <span class="text-sm text-gray-400 italic" title="PDF eliminado">
                                ${sourceInfo.name} (eliminado)
                            </span>
                        </div>
                    `;
                } else {
                    // No hay información
                    sourcePdfHtml = `
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-file-pdf text-gray-300 text-sm"></i>
                            <span class="text-sm text-gray-400 italic">
                                No disponible
                            </span>
                        </div>
                    `;
                }

                html += `
                    <tr class="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all group">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i class="fa-solid fa-file-word text-blue-600 text-lg"></i>
                                </div>
                                <span class="font-medium text-gray-800">${fileName}</span>
                            </div>
                        </td>
                 
                        <td class="px-6 py-4 text-gray-600">${formattedDate}</td>
                        <td class="px-6 py-4">
                            ${sourcePdfHtml}
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex gap-2">
                                
                                <button onclick="downloadWordFile('${fileId}', '${fileName}')" class="w-9 h-9 rounded-xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all" title="Descargar">
                                    <i class="fa-solid fa-download"></i>
                                </button>
                                <button onclick="generateExcelFromWord('${fileId}', '${fileName}')" 
                                    class="w-9 h-9 rounded-xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all" 
                                    title="Generar Excel desde Word">
                                    <i class="fa-solid fa-file-excel"></i>
                                </button>
                                
                                <button onclick="showDeleteWordModal('${fileId}', '${fileName}')" class="w-9 h-9 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Eliminar">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });

            tbody.innerHTML = html;
            updateWordPagination();
        }

        // ============================================
        // FUNCIÓN PARA GENERAR WORD DESDE PDF (CON PROGRESO REALISTA)
        // ============================================
        async function generateWordFromPdf(fileId) {
            try {
                showProgressSpinner("Iniciando generación con IA...");

                // Inicializar progreso
                updateProgress(0, "Preparando sistema...");
                await new Promise(resolve => setTimeout(resolve, 500));

                // Obtener el nombre del PDF original
                updateProgress(5, "Buscando archivo PDF...");
                const pdfFile = allFiles.find(f => f.id === fileId);
                if (!pdfFile) {
                    throw new Error("No se encontró el PDF original");
                }

                const pdfName = pdfFile.originalName;
                console.log("📄 Generando Word desde PDF:", pdfName);

                updateProgress(10, "PDF encontrado, procesando...");
                await new Promise(resolve => setTimeout(resolve, 600));

                // 1️⃣ Generar estructura JSON (10-50%)
                updateProgress(15, "Conectando con IA...");

                const parseStartTime = Date.now();
                const estructura = await WordApi.parsePdfWithAI(fileId);

                if (!estructura.success) {
                    throw new Error("No se pudo generar la estructura con IA");
                }

                // Calcular progreso basado en tiempo real
                const parseElapsed = Date.now() - parseStartTime;
                let progress = Math.min(50, 15 + Math.floor(parseElapsed / 300));

                updateProgress(progress, "Estructura analizada, preparando Word...");
                console.log("Estructura generada:", estructura.data);
                await new Promise(resolve => setTimeout(resolve, 700));

                // 2️⃣ Generar Word (50-95%)
                updateProgress(55, "Generando documento Word...");

                const wordStartTime = Date.now();
                const word = await WordApi.generateFromAiStructure(
                    estructura.data,
                    fileId,
                    pdfName
                );

                if (!word.success) {
                    throw new Error("No se pudo generar el Word");
                }

                // Calcular progreso de generación
                const wordElapsed = Date.now() - wordStartTime;
                progress = Math.min(95, 55 + Math.floor(wordElapsed / 200));

                updateProgress(progress, "Word generado, preparando archivo...");
                await new Promise(resolve => setTimeout(resolve, 800));

                // Finalizar (95-100%)
                updateProgress(98, "Procesando archivo final...");
                await new Promise(resolve => setTimeout(resolve, 600));

                // Actualizar tabla de Word
                await loadWordDocuments();

                updateProgress(100, "¡Word generado con éxito!");
                await new Promise(resolve => setTimeout(resolve, 800));

                hideProgressSpinner();
                showToast(`Word generado: ${word.data.originalName}`, "success");

            } catch (error) {
                hideProgressSpinner();
                console.error(error);
                showToast('Error generando Word: ' + error.message, 'error');

            }
        }

        // ============================================
        // FUNCIÓN PARA GENERAR EXCEL DESDE WORD (CORREGIDA)
        // ============================================
        async function generateExcelFromWord(wordFileId, wordFileName) {
            console.log("🚨 DEBUG WORD:", {
                wordFileId,
                wordFileName
            });
            try {
                showProgressSpinner("📊 Iniciando generación de Excel...");

                // Inicializar progreso en 0
                updateProgress(0, "Preparando entorno...");

                // Pequeña pausa para mostrar el inicio
                await new Promise(resolve => setTimeout(resolve, 500));

                // PASO 1: Obtener contenido temático (0-20%)
                updateProgress(5, "Conectando con el servidor...");

                // Simular tiempo de conexión
                await new Promise(resolve => setTimeout(resolve, 800));

                updateProgress(10, "Extrayendo contenido del Word...");

                const startTime = Date.now();
                const contenidoTematico = await ExcelApi.getContenidoTematico(wordFileId);

                if (!contenidoTematico) {
                    throw new Error("No se pudo obtener el contenido del Word");
                }

                // Calcular tiempo transcurrido para ajustar progreso
                const elapsedTime = Date.now() - startTime;
                let progress = Math.min(20, 10 + Math.floor(elapsedTime / 200)); // Máximo 20%

                updateProgress(progress, "Contenido extraído correctamente");
                await new Promise(resolve => setTimeout(resolve, 600));

                // PASO 2: Generar reactivos (20-60%)
                updateProgress(25, "📋 Generando reactivos con IA...");

                const reactivosStartTime = Date.now();
                const reactivosResult = await ExcelApi.generateExcelReactivos(contenidoTematico);

                // Calcular progreso basado en tiempo real (20-60%)
                const reactivosElapsed = Date.now() - reactivosStartTime;
                progress = Math.min(60, 25 + Math.floor(reactivosElapsed / 300)); // Máximo 60%

                updateProgress(progress, "Reactivos generados, organizando...");
                await new Promise(resolve => setTimeout(resolve, 700));

                // PASO 3: Preparar datos para Excel (60-75%)
                updateProgress(65, "Procesando datos...");

                // Pequeña pausa para procesamiento
                await new Promise(resolve => setTimeout(resolve, 1000));

                let datosParaExcel = reactivosResult;
                if (reactivosResult.materias) datosParaExcel = reactivosResult.materias;
                else if (reactivosResult.data) datosParaExcel = reactivosResult.data;
                else if (reactivosResult.reactivos) datosParaExcel = reactivosResult.reactivos;

                updateProgress(75, "Datos procesados, generando Excel...");
                await new Promise(resolve => setTimeout(resolve, 500));

                // PASO 4: Generar Excel (75-95%)
                updateProgress(80, "Creando archivo Excel...");

                const excelStartTime = Date.now();
                const excelResult = await ExcelApi.generateExcel(
                    datosParaExcel,
                    wordFileId,
                    wordFileName
                );

                console.log("📊 Resultado de generar Excel:", excelResult);
                const fileId = excelResult.fileId || excelResult.Id || excelResult.id;
                console.log("📊 ID del archivo generado:", fileId);

                if (fileId) {
                    updateProgress(90, "Actualizando lista de archivos...");
                    
                    // Estrategia: intentar cargar hasta que aparezca el archivo
                    let attempts = 0;
                    const maxAttempts = 6; // 6 intentos = ~5 segundos máximo
                    
                    while (attempts < maxAttempts) {
                        attempts++;
                        updateProgress(90 + attempts, `Verificando archivo (intento ${attempts}/${maxAttempts})...`);
                        
                        // Cargar la lista actualizada (sin mostrar loading)
                        await loadExcelFiles(false);
                        
                        // Verificar si el archivo ya está en la lista
                        const fileExists = allExcelFiles.some(f => f.id === fileId);
                        
                        if (fileExists) {
                            console.log(`✅ Archivo encontrado en el intento ${attempts}`);
                            
                            // Forzar re-renderizado de la tabla
                            filteredExcelFiles = [...allExcelFiles];
                            renderExcelTable();
                            
                            updateProgress(99, "Archivo listo en la tabla");
                            await new Promise(resolve => setTimeout(resolve, 400));
                            
                            hideProgressSpinner();
                            showToast('✅ Excel generado correctamente', 'success');
                            return; // Salir de la función
                        }
                        
                        // Esperar antes del siguiente intento
                        await new Promise(resolve => setTimeout(resolve, 800));
                    }
                    
                    // Si llegamos aquí, no se encontró el archivo después de varios intentos
                    console.warn("⚠️ El archivo no apareció en la lista después de varios intentos");
                    
                    // Aún así, cargamos la lista una última vez
                    await loadExcelFiles(true);
                    
                    updateProgress(99, "Proceso completado");
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    hideProgressSpinner();
                    showToast('✅ Excel generado (puede tardar en aparecer en la lista)', 'success');
                    
                } else {
                    hideProgressSpinner();
                    showToast('✅ Proceso completado', 'success');
                }

            } catch (error) {
                hideProgressSpinner();
                console.error('❌ Error:', error);
showToast('Error al generar Excel: ' + error.message, 'error');
            }
        }

        // ============================================
        // FUNCIÓN PARA SUBIR ARCHIVO (CON PROGRESO REAL)
        // ============================================
        document.getElementById('uploadForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const file = fileInput.files[0];
            if (!file) {
               showToast('Por favor selecciona un archivo PDF', 'error');
                return;
            }

            progressContainer.classList.remove('hidden');
            showProgressSpinner("Subiendo archivo PDF...");

            // Progreso inicial
            updateProgress(5, "Preparando archivo...");
            await new Promise(resolve => setTimeout(resolve, 500));

            try {
                updateProgress(10, "Iniciando transferencia...");

                // Aquí podrías implementar el progreso real de subida si tu API lo soporta
                // Por ahora usamos progreso basado en tiempo
                const uploadStartTime = Date.now();

                const result = await PdfApi.uploadPdfFile(file);

                // Calcular tiempo de subida
                const uploadElapsed = Date.now() - uploadStartTime;
                let progress = Math.min(90, 10 + Math.floor(uploadElapsed / 100));

                if (result.success) {
                    progressBar.style.width = '100%';
                    progressPercent.textContent = '100%';

                    // Completar progreso
                    progress = 95;
                    updateProgress(progress, "Archivo subido, procesando...");
                    await new Promise(resolve => setTimeout(resolve, 800));

                    updateProgress(98, "Actualizando lista de archivos...");
                    await loadFiles();

                    updateProgress(100, "¡PDF subido correctamente!");
                    await new Promise(resolve => setTimeout(resolve, 800));

                    hideProgressSpinner();
                    showToast('✅ Documento subido correctamente', 'success');
                    resetForm();
                } else {
                    throw new Error(result.error);
                }
            } catch (error) {
                hideProgressSpinner();
                progressContainer.classList.add('hidden');
                showErrorModal('Error al subir', error.message);
            }
        });

        // ============================================
        // FUNCIÓN CONFIRMAR ELIMINACIÓN (CON PROGRESO)
        // ============================================
        async function confirmDelete() {
            if (!pendingDeleteId) return;

            const deleteBtn = event.target.closest('button');
            const originalText = deleteBtn.innerHTML;
            deleteBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Eliminando...';
            deleteBtn.disabled = true;

            closeDeleteModal();
            showProgressSpinner("Eliminando archivo...");

            // Progreso inicial
            updateProgress(10, "Verificando archivo...");
            await new Promise(resolve => setTimeout(resolve, 500));

            if (pendingDeleteType === 'pdf') {
                const idToDelete = pendingDeleteId;
                console.log("Eliminando PDF:", idToDelete);

                updateProgress(30, "Eliminando PDF...");
                const result = await PdfApi.deleteFile(idToDelete);

                if (result.success) {
                    updateProgress(70, "PDF eliminado, actualizando...");
                    await new Promise(resolve => setTimeout(resolve, 600));

                    updateProgress(90, "Refrescando vista...");
                    await loadFiles();

                    updateProgress(100, "¡Proceso completado!");
                    await new Promise(resolve => setTimeout(resolve, 600));

                    hideProgressSpinner();
                    showToast('Documento PDF eliminado correctamente', 'success');
                } else {
                    hideProgressSpinner();
                    showToast('Error al eliminar: ' + result.error, 'error');
                }
            } else if (pendingDeleteType === 'word') {
                console.log("Eliminando Word generado:", pendingDeleteId);

                updateProgress(30, "Eliminando Word...");
                const result = await WordApi.deleteGeneratedFile(pendingDeleteId);

                if (result.success) {
                    updateProgress(70, "Word eliminado, actualizando...");
                    await new Promise(resolve => setTimeout(resolve, 600));

                    updateProgress(90, "Refrescando vista...");
                    await loadWordDocuments();

                    updateProgress(100, "¡Proceso completado!");
                    await new Promise(resolve => setTimeout(resolve, 600));

                    hideProgressSpinner();
                    showToast('Documento Word eliminado correctamente', 'success');
                } else {
                    hideProgressSpinner();
                     showToast('Error al eliminar Word: ' + result.error, 'error');

                }
            } else if (pendingDeleteType === 'excel') {
                console.log("Eliminando Excel generado:", pendingDeleteId);

                updateProgress(30, "Eliminando Excel...");

                try {
                    const result = await ExcelApi.deleteGeneratedExcel(pendingDeleteId);

                    if (result) {
                        updateProgress(70, "Excel eliminado, actualizando...");
                        await new Promise(resolve => setTimeout(resolve, 600));

                        updateProgress(90, "Refrescando vista...");
                        await loadExcelFiles(true);

                        updateProgress(100, "¡Proceso completado!");
                        await new Promise(resolve => setTimeout(resolve, 600));

                        hideProgressSpinner();
                        showToast('Documento Excel eliminado correctamente', 'success');
                    } else {
                        hideProgressSpinner();
                        showToast('Error al eliminar Excel', 'error');
                    }
                } catch (error) {
                    hideProgressSpinner();
                    showToast('Error al eliminar Excel', 'error');
                }
            }

            deleteBtn.innerHTML = originalText;
            deleteBtn.disabled = false;
        }

        // ============================================
        // ACTUALIZAR ESTADÍSTICAS
        // ============================================
        function updateHeaderStats() {
            updatePDFStats();
            updateWordStats();
            updateExcelStats();
        }

        function updatePDFStats() {
            const totalPDFs = allFiles.length;
            document.getElementById('totalDocumentosPDF').textContent = `${totalPDFs} ${totalPDFs === 1 ? 'PDF' : 'PDFs'}`;
            document.getElementById('pdfCountBadge').textContent = `${totalPDFs} ${totalPDFs === 1 ? 'documento' : 'documentos'}`;
        }

        function updateWordStats() {
            const totalWords = allWordFiles.length;
            document.getElementById('totalDocumentosWord').textContent = `${totalWords} ${totalWords === 1 ? 'Word' : 'Words'}`;
            document.getElementById('wordCountBadge').textContent = `${totalWords} ${totalWords === 1 ? 'documento' : 'documentos'}`;
        }

        function updateExcelStats() {
            const totalExcels = allExcelFiles.length;
            document.getElementById('excelCountBadge').textContent = `${totalExcels} ${totalExcels === 1 ? 'documento' : 'documentos'}`;
        }

        // ============================================
        // DESCARGAR ARCHIVO PDF
        // ============================================
        // ============================================
        // DESCARGAR ARCHIVO PDF (VERSIÓN CON FETCH)
        // ============================================
        async function downloadFile(id, fileName) {
            try {
                showToast(`Descargando ${fileName}...`, 'success');
                
                console.log("Descargando - ID:", id);
                console.log("Descargando - Nombre:", fileName);
                
                // Hacer fetch exactamente como lo hace el visor
                const response = await fetch(`http://localhost:5074/api/pdf-files/${id}`);
                
                if (!response.ok) {
                    throw new Error('Error al descargar');
                }
                
                // Obtener el blob
                const blob = await response.blob();
                
                // Crear URL del blob
                const blobUrl = window.URL.createObjectURL(blob);
                
                // Crear enlace temporal
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = fileName; // Forzar el nombre
                
                document.body.appendChild(link);
                link.click();
                
                // Limpiar
                setTimeout(() => {
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(blobUrl);
                }, 100);
                
            } catch (error) {
                showToast('Error de conexión', 'error');
                console.error(error);
            }
        }

        // ============================================
        // DESCARGAR ARCHIVO WORD
        // ============================================
        function downloadWordFile(fileId, fileName) {
            showToast(`Descargando ${fileName}...`, 'success');

            // Construir URL de descarga para archivos Word generados
            const downloadUrl = `${WordApi.baseUrl}/word-files/generated/${fileId}`;

            // Crear un enlace temporal para descargar
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName || 'documento.docx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // ============================================
        // DESCARGAR ARCHIVO EXCEL
        // ============================================
        async function downloadExcelFile(fileId, fileName) {
            try {
                showToast(`Descargando ${fileName}...`, 'success');

                // 🔥 PASAS EL NOMBRE REAL DEL EXCEL
                await ExcelApi.downloadExcel(fileId, fileName);

            } catch (error) {
                showToast('Error al descargar: ' + error.message, 'error');

            }
        }

        // ============================================
        // BÚSQUEDA EN TIEMPO REAL (PDF)
        // ============================================
        document.getElementById('searchInput').addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase();

            filteredFiles = allFiles.filter(file => {
                const fileName = (file.originalName || file.path || '').toLowerCase();
                return fileName.includes(searchTerm) || (file.id && file.id.includes(searchTerm));
            });

            currentPage = 1;
            renderTable();
        });

        // ============================================
        // BÚSQUEDA EN TIEMPO REAL (WORD)
        // ============================================
        document.getElementById('searchWordInput').addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase();

            filteredWordFiles = allWordFiles.filter(file => {
                const fileName = (file.originalName || '').toLowerCase();
                const sourceName = (file.sourcePdfName || '').toLowerCase();

                return fileName.includes(searchTerm) ||
                    sourceName.includes(searchTerm) ||
                    (file.id && file.id.includes(searchTerm));
            });

            currentWordPage = 1;
            renderWordTable();
        });

        // ============================================
        // BÚSQUEDA EN TIEMPO REAL EXCEL
        // ============================================
        document.getElementById('searchExcelInput')?.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase();

            filteredExcelFiles = allExcelFiles.filter(file => {
                const fileName = (file.originalName || '').toLowerCase();
                const wordOrigen = (file.sourceWordName || file.sourceFileName || '').toLowerCase();

                return fileName.includes(searchTerm) || wordOrigen.includes(searchTerm);
            });

            currentExcelPage = 1;
            renderExcelTable();
        });

        // ============================================
        // ACTUALIZAR PAGINACIÓN PDF
        // ============================================
        function updatePagination() {
            const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
            const paginationInfo = document.getElementById('paginationInfo');
            const paginationControls = document.getElementById('paginationControls');

            const start = (currentPage - 1) * itemsPerPage + 1;
            const end = Math.min(currentPage * itemsPerPage, filteredFiles.length);

            paginationInfo.innerHTML = `
                <i class="fa-regular fa-file-pdf mr-2"></i>
                Mostrando ${filteredFiles.length > 0 ? start : 0}-${end} de ${filteredFiles.length} resultados
            `;

            if (totalPages <= 1) {
                paginationControls.innerHTML = '';
                return;
            }

            let controls = '';

            controls += `
                <button onclick="changePage(${currentPage - 1})" 
                    ${currentPage === 1 ? 'disabled' : ''}
                    class="w-10 h-10 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-[#00002c] hover:text-white hover:border-[#00002c] transition-all ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}">
                    <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>
            `;

            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                    controls += `
                        <button onclick="changePage(${i})" 
                            class="w-10 h-10 rounded-xl ${i === currentPage ? 'bg-gradient-to-r from-[#00002c] to-[#1a1a5c] text-white shadow-md' : 'border-2 border-gray-200 text-gray-500 hover:bg-[#00002c] hover:text-white hover:border-[#00002c]'} transition-all">
                            ${i}
                        </button>
                    `;
                } else if (i === currentPage - 2 || i === currentPage + 2) {
                    controls += `<span class="w-10 h-10 flex items-center justify-center text-gray-400">...</span>`;
                }
            }

            controls += `
                <button onclick="changePage(${currentPage + 1})" 
                    ${currentPage === totalPages ? 'disabled' : ''}
                    class="w-10 h-10 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-[#00002c] hover:text-white hover:border-[#00002c] transition-all ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}">
                    <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
            `;

            paginationControls.innerHTML = controls;
        }

        // ============================================
        // ACTUALIZAR PAGINACIÓN WORD
        // ============================================
        function updateWordPagination() {
            const totalPages = Math.ceil(filteredWordFiles.length / itemsPerPage);
            const paginationInfo = document.getElementById('wordPaginationInfo');
            const paginationControls = document.getElementById('wordPaginationControls');

            const start = (currentWordPage - 1) * itemsPerPage + 1;
            const end = Math.min(currentWordPage * itemsPerPage, filteredWordFiles.length);

            paginationInfo.innerHTML = `
                <i class="fa-regular fa-file-word mr-2 text-blue-500"></i>
                Mostrando ${filteredWordFiles.length > 0 ? start : 0}-${end} de ${filteredWordFiles.length} resultados
            `;

            if (totalPages <= 1) {
                paginationControls.innerHTML = '';
                return;
            }

            let controls = '';

            controls += `
                <button onclick="changeWordPage(${currentWordPage - 1})" 
                    ${currentWordPage === 1 ? 'disabled' : ''}
                    class="w-10 h-10 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all ${currentWordPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}">
                    <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>
            `;

            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentWordPage - 1 && i <= currentWordPage + 1)) {
                    controls += `
                        <button onclick="changeWordPage(${i})" 
                            class="w-10 h-10 rounded-xl ${i === currentWordPage ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' : 'border-2 border-gray-200 text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600'} transition-all">
                            ${i}
                        </button>
                    `;
                } else if (i === currentWordPage - 2 || i === currentWordPage + 2) {
                    controls += `<span class="w-10 h-10 flex items-center justify-center text-gray-400">...</span>`;
                }
            }

            controls += `
                <button onclick="changeWordPage(${currentWordPage + 1})" 
                    ${currentWordPage === totalPages ? 'disabled' : ''}
                    class="w-10 h-10 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all ${currentWordPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}">
                    <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
            `;

            paginationControls.innerHTML = controls;
        }

        // ============================================
        // ACTUALIZAR PAGINACIÓN EXCEL
        // ============================================
        function updateExcelPagination() {
            const totalPages = Math.ceil(filteredExcelFiles.length / itemsPerPageExcel);
            const paginationInfo = document.getElementById('excelPaginationInfo');
            const paginationControls = document.getElementById('excelPaginationControls');

            if (!paginationInfo || !paginationControls) return;

            const start = (currentExcelPage - 1) * itemsPerPageExcel + 1;
            const end = Math.min(currentExcelPage * itemsPerPageExcel, filteredExcelFiles.length);

            paginationInfo.innerHTML = `
                <i class="fa-regular fa-file-excel mr-2 text-green-500"></i>
                Mostrando ${filteredExcelFiles.length > 0 ? start : 0}-${end} de ${filteredExcelFiles.length} resultados
            `;

            if (totalPages <= 1) {
                paginationControls.innerHTML = '';
                return;
            }

            let controls = '';

            controls += `
                <button onclick="changeExcelPage(${currentExcelPage - 1})" 
                    ${currentExcelPage === 1 ? 'disabled' : ''}
                    class="w-10 h-10 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all ${currentExcelPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}">
                    <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>
            `;

            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentExcelPage - 1 && i <= currentExcelPage + 1)) {
                    controls += `
                        <button onclick="changeExcelPage(${i})" 
                            class="w-10 h-10 rounded-xl ${i === currentExcelPage ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' : 'border-2 border-gray-200 text-gray-500 hover:bg-green-600 hover:text-white hover:border-green-600'} transition-all">
                            ${i}
                        </button>
                    `;
                } else if (i === currentExcelPage - 2 || i === currentExcelPage + 2) {
                    controls += `<span class="w-10 h-10 flex items-center justify-center text-gray-400">...</span>`;
                }
            }

            controls += `
                <button onclick="changeExcelPage(${currentExcelPage + 1})" 
                    ${currentExcelPage === totalPages ? 'disabled' : ''}
                    class="w-10 h-10 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all ${currentExcelPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}">
                    <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
            `;

            paginationControls.innerHTML = controls;
        }

        // ============================================
        // CAMBIAR PÁGINA PDF
        // ============================================
        function changePage(page) {
            currentPage = page;
            renderTable();
        }

        // ============================================
        // CAMBIAR PÁGINA WORD
        // ============================================
        function changeWordPage(page) {
            currentWordPage = page;
            renderWordTable();
        }

        // ============================================
        // CAMBIAR PÁGINA EXCEL
        // ============================================
        function changeExcelPage(page) {
            currentExcelPage = page;
            renderExcelTable();
        }

        // ============================================
        // FUNCIONES PARA EXCEL - CORREGIDAS
        // ============================================

        // CARGAR ARCHIVOS EXCEL DESDE API
        async function loadExcelFiles(showLoading = true) {
            try {
                const tbody = document.getElementById('excelFilesTableBody');
                
                // Solo mostrar loading si se solicita explícitamente
                if (showLoading) {
                    tbody.innerHTML = `
                        <tr id="loadingExcelRow">
                            <td colspan="5" class="px-6 py-8 text-center">
                                <div class="flex flex-col items-center justify-center">
                                    <i class="fa-solid fa-spinner fa-spin text-green-600 text-3xl mb-3"></i>
                                    <p class="text-gray-500">Cargando archivos Excel...</p>
                                </div>
                            </td>
                        </tr>
                    `;
                }

                const result = await ExcelApi.getAllGeneratedExcel();

                if (result) {
                    allExcelFiles = result || [];
                    console.log("📊 Archivos Excel generados:", allExcelFiles);

                    // Aplicar filtro de búsqueda si existe
                    const searchTerm = document.getElementById('searchExcelInput')?.value.toLowerCase() || '';
                    if (searchTerm) {
                        filteredExcelFiles = allExcelFiles.filter(file => {
                            const fileName = (file.originalName || '').toLowerCase();
                            const wordOrigen = (file.sourceWordName || file.sourceFileName || '').toLowerCase();
                            return fileName.includes(searchTerm) || wordOrigen.includes(searchTerm);
                        });
                    } else {
                        filteredExcelFiles = [...allExcelFiles];
                    }
                    
                    renderExcelTable();
                    updateExcelStats();
                }
            } catch (error) {
                console.error('Error cargando Excel:', error);
                if (showLoading) {
                    document.getElementById('excelFilesTableBody').innerHTML = `
                        <tr>
                            <td colspan="5" class="px-6 py-12 text-center">
                                <div class="flex flex-col items-center">
                                    <i class="fa-solid fa-file-excel text-gray-300 text-5xl mb-4"></i>
                                    <p class="text-gray-500 text-lg">Error al cargar archivos Excel</p>
                                    <p class="text-gray-400 text-sm mt-1">${error.message}</p>
                                </div>
                            </td>
                        </tr>
                    `;
                }
            }
        }

        // RENDERIZAR TABLA EXCEL
        function renderExcelTable() {
            const tbody = document.getElementById('excelFilesTableBody');
            const start = (currentExcelPage - 1) * itemsPerPageExcel;
            const end = start + itemsPerPageExcel;
            const pageFiles = filteredExcelFiles.slice(start, end);

            if (filteredExcelFiles.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center">
                                <i class="fa-solid fa-file-excel text-gray-300 text-5xl mb-4"></i>
                                <p class="text-gray-500 text-lg">No hay archivos Excel generados</p>
                                <p class="text-gray-400 text-sm mt-1">Genera tu primer Excel desde un Word</p>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }

            let html = '';
            pageFiles.forEach(file => {
                if (!file.id) return;

                const fileId = file.id;
                const fileName = file.originalName || 'Sin nombre';

                const uploadDate = file.uploadDate ? new Date(file.uploadDate) : new Date();
                const formattedDate = uploadDate.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const wordOrigen = file.sourceWordName || file.sourceFileName || 'Word no disponible';

                html += `
                    <tr class="hover:bg-gradient-to-r hover:from-green-50/30 hover:to-emerald-50/30 transition-all group">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i class="fa-solid fa-file-excel text-green-600 text-lg"></i>
                                </div>
                                <span class="font-medium text-gray-800">${fileName}</span>
                            </div>
                        </td>
                        <td class="px-6 py-4 text-gray-600">${formattedDate}</td>
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-2">
                                <i class="fa-solid fa-file-word text-blue-500 text-sm"></i>
                                <span class="text-sm text-gray-600">${wordOrigen}</span>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex gap-2">
                               
                                <button onclick="downloadExcelFile('${fileId}', '${fileName}')" class="w-9 h-9 rounded-xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all" title="Descargar">
                                    <i class="fa-solid fa-download"></i>
                                </button>
                                <button onclick="showDeleteExcelModal('${fileId}', '${fileName}')" class="w-9 h-9 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Eliminar">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });

            tbody.innerHTML = html;
            updateExcelPagination();
            updateExcelStats();
        }

        // FUNCIONES DE ACCIONES PARA EXCEL
        function verExcel(fileId) {
            showToast('Visor de Excel próximamente', 'success');
        }

        // REFRESCAR TABLA EXCEL
        function refreshExcelTable() {
            loadExcelFiles(true);
        }

        // ============================================
        // ELEMENTOS DEL DOM
        // ============================================
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const selectFileBtn = document.getElementById('selectFileBtn');
        const fileInfo = document.getElementById('fileInfo');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const changeFileBtn = document.getElementById('changeFileBtn');
        const progressContainer = document.getElementById('progressContainer');
        const progressBar = document.getElementById('progressBar');
        const progressPercent = document.getElementById('progressPercent');

        function resetForm() {
            fileInfo.classList.add('hidden');
            progressContainer.classList.add('hidden');
            fileInput.value = '';
        }

        selectFileBtn.addEventListener('click', () => {
            fileInput.click();
        });

        changeFileBtn.addEventListener('click', () => {
            fileInput.click();
        });

        dropZone.addEventListener('click', (e) => {
            if (e.target !== selectFileBtn && e.target !== changeFileBtn) {
                fileInput.click();
            }
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-[#00002c]', 'bg-[#00002c]/5');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-[#00002c]', 'bg-[#00002c]/5');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-[#00002c]', 'bg-[#00002c]/5');
            const file = e.dataTransfer.files[0];
            if (file && file.type === 'application/pdf') {
                handleFile(file);
            } else {
                showErrorModal('Archivo no válido', 'Solo se permiten archivos PDF');
            }
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleFile(file);
            }
        });

        function handleFile(file) {
            if (file.type !== 'application/pdf') {
                showToast('Solo se permiten archivos PDF', 'error');
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                showToast('El archivo no puede ser mayor a 10MB', 'error');
                return;
            }

            fileName.textContent = file.name;
            fileSize.textContent = formatFileSize(file.size);
            fileInfo.classList.remove('hidden');
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        }

        // ============================================
        // CERRAR MODALES CON CLICK FUERA
        // ============================================
     window.addEventListener('click', (e) => {
    const deleteModal = document.getElementById('deleteConfirmModal');
    const pdfModal = document.getElementById('pdfModal');
    const wordModal = document.getElementById('wordModal');

    if (e.target === deleteModal) {
        closeDeleteModal();
    }
    if (e.target === pdfModal) {
        closePdfModal();
    }
    if (e.target === wordModal) {
        closeWordModal();
    }
});

        // ============================================
        // CERRAR MODALES CON TECLA ESC
        // ============================================
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeDeleteModal();
                closePdfModal();
                closeWordModal();
            }
        });