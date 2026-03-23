// ============================================
// VARIABLES GLOBALES
// ============================================
let materias = [];
let archivoAEliminar = null;
let archivosExcel = [];
let currentPage = 1;
let itemsPerPage = 5;
let paginatedArchivos = [];
let activeProcesses = 0;
let carreraBloqueada = false;
// ============================================
// FUNCIONES PARA SPINNER CON PROGRESO
// ============================================
function showProgressSpinner(message = 'Procesando...') {
    activeProcesses++;

    let spinner = document.getElementById('globalSpinner');
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.id = 'globalSpinner';
        spinner.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center transition-opacity duration-300';
        spinner.innerHTML = `
                    <div class="bg-white p-8 rounded-2xl shadow-2xl text-center transform scale-95 transition-all duration-300 max-w-md w-full mx-4" id="spinnerContent">
                        <div class="loading-spinner w-20 h-20 mx-auto mb-6" style="border-top-color: #2563eb; border-width: 4px;"></div>
                        <div class="mb-4">
                            <span class="text-4xl font-bold text-gray-800" id="progressPercentage">0%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
                            <div class="bg-gradient-to-r from-[#00002c] to-[#1a1a5c] h-3 rounded-full transition-all duration-300" id="progressBar" style="width: 0%"></div>
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

    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
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

// ===== FUNCIÓN PARA AGREGAR TEMA =====
function agregarTema() {
    const temasContainer = document.getElementById('temasContainer');
    const temasCount = document.getElementById('temasCount');
    const scrollInfo = document.getElementById('scrollInfo');

    const totalTemas = document.querySelectorAll('#temasContainer .tema-item-scroll').length;

    const nuevoTema = document.createElement('div');
    nuevoTema.className = 'tema-item-scroll animate-fade-in';
    nuevoTema.dataset.temaIndex = totalTemas;
    nuevoTema.innerHTML = `
                <div class="flex gap-2 items-start">
                    <div class="flex-1">
                        <input type="text" placeholder="Nombre del tema" 
                            class="tema-nombre w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-0 outline-none mb-2"
                            required>
                        <input type="number" placeholder="Cantidad de reactivos" min="1"
                            class="tema-cantidad w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-0 outline-none"
                            required>
                    </div>
                    <button type="button" onclick="eliminarTema(this)" 
                        class="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;

    temasContainer.appendChild(nuevoTema);

    setTimeout(() => {
        nuevoTema.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    const nuevoTotal = totalTemas + 1;
    temasCount.textContent = `${nuevoTotal} temas`;

    if (nuevoTotal > 3) {
        scrollInfo.textContent = `📜 ${nuevoTotal - 3} ocultos`;
        scrollInfo.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
    } else {
        scrollInfo.textContent = `${nuevoTotal} visibles`;
        scrollInfo.style.background = 'linear-gradient(135deg, #2563eb, #1e40af)';
    }
}

// ===== FUNCIÓN PARA ELIMINAR TEMA =====
function eliminarTema(btn) {
    const temaItem = btn.closest('.tema-item-scroll');
    const temasCount = document.getElementById('temasCount');
    const scrollInfo = document.getElementById('scrollInfo');

    temaItem.style.transition = 'all 0.3s ease';
    temaItem.style.opacity = '0';
    temaItem.style.transform = 'translateX(-10px)';

    setTimeout(() => {
        temaItem.remove();

        const todosTemas = Array.from(document.querySelectorAll('#temasContainer .tema-item-scroll'));
        todosTemas.forEach((tema, index) => {
            tema.dataset.temaIndex = index;
        });

        const totalTemas = todosTemas.length;
        temasCount.textContent = `${totalTemas} temas`;

        if (totalTemas > 3) {
            scrollInfo.textContent = `📜 ${totalTemas - 3} ocultos`;
            scrollInfo.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        } else {
            scrollInfo.textContent = `${totalTemas} visibles`;
            scrollInfo.style.background = 'linear-gradient(135deg, #2563eb, #1e40af)';
        }
    }, 300);
}

function guardarMateria() {
    console.log("=== FUNCIÓN guardarMateria EJECUTADA ===");
    const materiaNombre = document.getElementById('materiaNombre').value;
    const carreraNombre = document.getElementById('carreraNombre').value;

    if (!carreraNombre) {
        mostrarError('Por favor ingresa el nombre de la carrera');
        return;
    }

    if (!materiaNombre) {
        mostrarError('Por favor ingresa el nombre de la materia');
        return;
    }

    const temas = [];
    const temaItems = document.querySelectorAll('#temasContainer .tema-item-scroll');

    if (temaItems.length === 0) {
        mostrarError('Agrega al menos un tema a la materia');
        return;
    }

    for (let item of temaItems) {
        const temaNombre = item.querySelector('.tema-nombre').value;
        const temaCantidad = item.querySelector('.tema-cantidad').value;

        if (!temaNombre || !temaCantidad) {
            mostrarError('Completa todos los campos de los temas');
            return;
        }

        temas.push({
            tema: temaNombre,
            numeroReactivos: parseInt(temaCantidad)
        });
    }

    const nuevaMateria = {
        materia: materiaNombre,
        temas: temas
    };

    materias.push(nuevaMateria);
    console.log("Entrando a guardarMateria");
    console.log("carreraBloqueada:", carreraBloqueada);
    // BLOQUEAR EL CAMPO DE CARRERA DESPUÉS DE LA PRIMERA MATERIA
    if (!carreraBloqueada) {
        console.log("BLOQUEANDO INPUT");
        const carreraInput = document.getElementById('carreraNombre');
        carreraInput.disabled = true;
        carreraInput.classList.add('bg-gray-100', 'cursor-not-allowed');
        carreraBloqueada = true;

        mostrarInfo('Nombre de carrera bloqueado. No se puede modificar después de agregar materias.');
    }

    document.getElementById('materiaNombre').value = '';
    document.getElementById('temasContainer').innerHTML = '';
    document.getElementById('temasCount').textContent = '0 temas';
    document.getElementById('scrollInfo').textContent = '0 visibles';
    document.getElementById('scrollInfo').style.background = 'linear-gradient(135deg, #2563eb, #1e40af)';

    actualizarListaMaterias();
    actualizarBotonEnviar();
    actualizarHeaderCounts();

    mostrarExito('Materia agregada correctamente');
}
// ===== FUNCIÓN PARA ACTUALIZAR LISTA DE MATERIAS =====
function actualizarListaMaterias() {
    const lista = document.getElementById('materiasLista');
    const countSpan = document.getElementById('materiasCount');
    const carreraDisplay = document.getElementById('carreraDisplay');
    const carreraNombre = document.getElementById('carreraNombre').value || 'Ingenieria en Sistemas';

    carreraDisplay.textContent = carreraNombre;

    if (materias.length === 0) {
        lista.innerHTML = `
                    <div class="text-center text-gray-500 py-8">
                        <i class="fa-solid fa-folder-open text-4xl mb-3 text-gray-300"></i>
                        <p>No hay materias registradas</p>
                        <p class="text-sm">Agrega materias usando el formulario</p>
                    </div>
                `;
        countSpan.textContent = '0';
        return;
    }

    countSpan.textContent = materias.length;

    let html = '';
    materias.forEach((materia, index) => {
        const totalReactivosMateria = materia.temas.reduce((sum, t) => sum + t.numeroReactivos, 0);

        html += `
                    <div class="materia-card bg-white p-5 rounded-xl shadow-sm animate-fade-in">
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-2">
                                    <i class="fa-solid fa-book text-blue-600 text-xl"></i>
                                    <h3 class="font-bold text-gray-800 text-lg">${materia.materia}</h3>
                                </div>
                                <div class="flex items-center gap-3 text-sm">
                                    <span class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                                        <i class="fa-regular fa-list mr-1"></i>
                                        ${materia.temas.length} temas
                                    </span>
                                    <span class="badge-reactivos">
                                        <i class="fa-regular fa-file-lines mr-1"></i>
                                        ${totalReactivosMateria} reactivos
                                    </span>
                                </div>
                            </div>
                            <button onclick="eliminarMateria(${index})" 
                                class="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                        
                        <div class="mt-4 space-y-2">
                            ${materia.temas.map(tema => `
                                <div class="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <i class="fa-regular fa-circle-check text-green-500 text-sm"></i>
                                        <span class="text-gray-700">${tema.tema}</span>
                                    </div>
                                    <span class="bg-orange-100 text-orange-600 px-2 py-1 rounded-lg text-xs font-medium">
                                        ${tema.numeroReactivos} reactivos
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
    });

    lista.innerHTML = html;
}

// ===== FUNCIÓN PARA ELIMINAR MATERIA =====
function eliminarMateria(index) {
    materias.splice(index, 1);
    actualizarListaMaterias();
    actualizarBotonEnviar();
    actualizarHeaderCounts();
    mostrarExito('Materia eliminada');

    // DESBLOQUEAR SI NO QUEDAN MATERIAS
    if (materias.length === 0 && carreraBloqueada) {
        const carreraInput = document.getElementById('carreraNombre');
        carreraInput.disabled = false;
        carreraInput.classList.remove('bg-gray-100', 'cursor-not-allowed');
        carreraBloqueada = false;
        mostrarInfo('Nombre de carrera desbloqueado. Puedes modificarlo nuevamente.');
    }
}

// ===== FUNCIÓN PARA ACTUALIZAR BOTÓN ENVIAR =====
function actualizarBotonEnviar() {
    const btnEnviar = document.getElementById('btnEnviar');
    const totalReactivos = document.getElementById('totalReactivos');

    const total = materias.reduce((sum, m) =>
        sum + m.temas.reduce((s, t) => s + t.numeroReactivos, 0), 0
    );

    totalReactivos.textContent = total;

    if (materias.length > 0) {
        btnEnviar.disabled = false;
        btnEnviar.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        btnEnviar.disabled = true;
        btnEnviar.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

// ===== FUNCIÓN PARA ACTUALIZAR HEADER =====
function actualizarHeaderCounts() {
    const totalMaterias = materias.length;
    const totalReactivos = materias.reduce((sum, m) =>
        sum + m.temas.reduce((s, t) => s + t.numeroReactivos, 0), 0
    );

    document.getElementById('totalMateriasHeader').innerHTML = `${totalMaterias} Materias`;
    document.getElementById('totalReactivosHeader').innerHTML = `${totalReactivos} Reactivos`;
}

// ===== FUNCIÓN PARA ENVIAR MATERIAS (CON SPINNER) =====
// ===== FUNCIÓN PARA ENVIAR MATERIAS (CON SPINNER) =====
async function enviarMaterias() {
    if (materias.length === 0) {
        mostrarError('No hay materias para enviar');
        return;
    }

    const carreraNombre = document.getElementById('carreraNombre').value;

    if (!carreraNombre) {
        mostrarError('Por favor ingresa el nombre de la carrera');
        return;
    }

    const data = {
        nombreCarrera: carreraNombre,
        materias: materias
    };

    try {
        showProgressSpinner("Preparando generación de Excel...");

        updateProgress(10, "Validando datos...");
        await new Promise(resolve => setTimeout(resolve, 300));

        updateProgress(30, "Conectando con el servidor...");
        await new Promise(resolve => setTimeout(resolve, 400));

        updateProgress(50, "Generando estructura de reactivos...");
        const result = await SubjetApi.generateExcelByTopics(data);

        updateProgress(80, "Creando archivo Excel...");
        await new Promise(resolve => setTimeout(resolve, 400));

        updateProgress(95, "Finalizando...");

        mostrarExito('¡Excel generado correctamente!');

        materias = [];
        actualizarListaMaterias();
        actualizarBotonEnviar();
        actualizarHeaderCounts();

        // ===== LIMPIAR TODO EL FORMULARIO =====
        limpiarFormularioCompleto();

        updateProgress(100, "¡Completado!");
        await new Promise(resolve => setTimeout(resolve, 500));

        hideProgressSpinner();
        await cargarArchivosExcel();

    } catch (error) {
        hideProgressSpinner();
        console.error('Error:', error);
        mostrarError('Error al generar Excel: ' + error.message);
    }
}

// ===== FUNCIÓN PARA LIMPIAR EL FORMULARIO COMPLETAMENTE =====
function limpiarFormularioCompleto() {
    // Limpiar campo de nombre de materia
    const materiaInput = document.getElementById('materiaNombre');
    if (materiaInput) {
        materiaInput.value = '';
    }

    // Limpiar campo de nombre de carrera
    const carreraInput = document.getElementById('carreraNombre');
    if (carreraInput) {
        carreraInput.value = '';
        carreraInput.disabled = false;
        carreraInput.classList.remove('bg-gray-100', 'cursor-not-allowed');
    }

    // Limpiar todos los temas del contenedor
    const temasContainer = document.getElementById('temasContainer');
    if (temasContainer) {
        temasContainer.innerHTML = '';
    }

    // Reiniciar contadores de temas
    const temasCount = document.getElementById('temasCount');
    if (temasCount) {
        temasCount.textContent = '0 temas';
    }

    const scrollInfo = document.getElementById('scrollInfo');
    if (scrollInfo) {
        scrollInfo.textContent = '0 visibles';
        scrollInfo.style.background = 'linear-gradient(135deg, #2563eb, #1e40af)';
    }

    // Reiniciar la variable de bloqueo
    carreraBloqueada = false;

    // Actualizar la visualización de la carrera en la lista
    const carreraDisplay = document.getElementById('carreraDisplay');
    if (carreraDisplay) {
        carreraDisplay.textContent = 'No seleccionada';
    }

    console.log("✅ Formulario limpiado completamente (incluyendo carrera)");
}

// ===== FUNCIONES PARA EXCEL =====
async function cargarArchivosExcel() {
    const loadingRow = document.getElementById('loadingExcelRow');
    const tableBody = document.getElementById('excelFilesTableBody');
    const countBadge = document.getElementById('excelCountBadge');

    try {
        if (loadingRow) loadingRow.style.display = '';
        archivosExcel = await SubjetApi.getAll();
        if (loadingRow) loadingRow.style.display = 'none';

        const totalArchivos = archivosExcel.length;
        countBadge.textContent = `${totalArchivos} ${totalArchivos === 1 ? 'documento' : 'documentos'}`;

        if (archivosExcel.length === 0) {
            mostrarTablaVacia(tableBody);
            actualizarPaginacionInfo(0, 0, 0);
            generarPaginacion(0);
            return;
        }

        currentPage = 1;
        actualizarPaginacion();

    } catch (error) {
        console.error('Error al cargar archivos Excel:', error);
        manejarErrorCarga(tableBody, error);
    }
}

function mostrarTablaVacia(tableBody) {
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `
                <td colspan="4" class="px-6 py-8 text-center">
                    <div class="flex flex-col items-center justify-center">
                        <i class="fa-solid fa-folder-open text-5xl mb-3 text-gray-300"></i>
                        <p class="text-gray-500 text-lg">No hay archivos Excel generados</p>
                        <p class="text-gray-400 text-sm">Genera tu primer archivo usando el formulario</p>
                    </div>
                </td>
            `;
    tableBody.appendChild(emptyRow);
}

function manejarErrorCarga(tableBody, error) {
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    const errorRow = document.createElement('tr');
    errorRow.innerHTML = `
                <td colspan="4" class="px-6 py-8 text-center">
                    <div class="flex flex-col items-center justify-center">
                        <i class="fa-solid fa-circle-exclamation text-red-500 text-5xl mb-3"></i>
                        <p class="text-red-500 text-lg">Error al cargar los archivos</p>
                        <p class="text-gray-400 text-sm">${error.message || 'Intenta de nuevo más tarde'}</p>
                        <button onclick="cargarArchivosExcel()" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
                            Reintentar
                        </button>
                    </div>
                </td>
            `;
    tableBody.appendChild(errorRow);
}

function actualizarPaginacion() {
    const tableBody = document.getElementById('excelFilesTableBody');

    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, archivosExcel.length);
    paginatedArchivos = archivosExcel.slice(start, end);

    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    paginatedArchivos.forEach((archivo, index) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-all duration-300 animate-fade-in';
        row.style.animationDelay = `${index * 0.05}s`;

        const fecha = new Date(archivo.uploadDate);
        const fechaFormateada = fecha.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const nombreArchivo = archivo.originalName || 'archivo.xlsx';
        const idCorto = archivo.id.substring(0, 8) + '...';

        row.innerHTML = `
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="file-icon-excel">
                                <i class="fa-solid fa-file-excel"></i>
                            </div>
                            <div>
                                <p class="font-semibold text-gray-800">${nombreArchivo}</p>
                                <p class="text-xs text-gray-500 flex items-center gap-1">
                                    <i class="fa-regular fa-circle-check text-green-500"></i>
                                    Path: ${archivo.path || 'No disponible'}
                                </p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm">
                            <p class="font-medium text-gray-800">${fechaFormateada}</p>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm">
                            <p class="font-mono text-xs text-gray-600">${idCorto}</p>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex gap-6">
                            <button onclick="descargarArchivo('${archivo.id}', '${archivo.originalName}')" class="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:scale-110" title="Descargar">
                                <i class="fa-solid fa-download"></i>
                            </button>
                            <button onclick="mostrarModalEliminar('${nombreArchivo}', '${archivo.id}')" class="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110" title="Eliminar">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;

        tableBody.appendChild(row);
    });

    actualizarPaginacionInfo(start + 1, end, archivosExcel.length);
    generarPaginacion(archivosExcel.length);
}

function actualizarPaginacionInfo(start, end, total) {
    document.getElementById('paginationStart').textContent = total > 0 ? start : 0;
    document.getElementById('paginationEnd').textContent = total > 0 ? end : 0;
    document.getElementById('paginationTotal').textContent = total;
}

function generarPaginacion(totalItems) {
    const paginationContainer = document.getElementById('excelPaginationControls');
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    paginationHTML += `
                <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
                    onclick="cambiarPagina(${currentPage - 1})" 
                    ${currentPage === 1 ? 'disabled' : ''}>
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
            `;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                        <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                            onclick="cambiarPagina(${i})">
                            ${i}
                        </button>
                    `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `
                        <button class="pagination-btn disabled">
                            ...
                        </button>
                    `;
        }
    }

    paginationHTML += `
                <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                    onclick="cambiarPagina(${currentPage + 1})" 
                    ${currentPage === totalPages ? 'disabled' : ''}>
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            `;

    paginationContainer.innerHTML = paginationHTML;
}

function cambiarPagina(page) {
    const totalPages = Math.ceil(archivosExcel.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    actualizarPaginacion();
}

// ===== FUNCIÓN DE DESCARGA =====
async function descargarArchivo(id, fileName) {
    try {
        showProgressSpinner("Preparando descarga...");
        updateProgress(30, "Obteniendo archivo...");

        const downloadUrl = `${API_BASE_URL}/${id}/excel`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName || 'archivo.xlsx';

        updateProgress(70, "Descargando...");
        document.body.appendChild(link);
        link.click();

        updateProgress(100, "¡Descarga completada!");
        await new Promise(resolve => setTimeout(resolve, 500));

        hideProgressSpinner();
        document.body.removeChild(link);
    } catch (error) {
        hideProgressSpinner();
        mostrarError('Error al descargar', error.message);
    }
}

// ===== FUNCIÓN DE ELIMINACIÓN (CON SPINNER) =====
async function confirmDelete() {
    if (archivoAEliminar) {
        try {
            showProgressSpinner("Eliminando archivo...");

            updateProgress(30, "Procesando solicitud...");
            await SubjetApi.deleteById(archivoAEliminar.id);

            updateProgress(70, "Actualizando lista...");
            mostrarExito(`Archivo ${archivoAEliminar.nombre} eliminado correctamente`);
            closeDeleteModal();

            updateProgress(90, "Refrescando vista...");
            await cargarArchivosExcel();

            updateProgress(100, "¡Completado!");
            await new Promise(resolve => setTimeout(resolve, 500));

            hideProgressSpinner();

        } catch (error) {
            hideProgressSpinner();
            console.error('Error al eliminar:', error);
            mostrarError('Error al eliminar el archivo');
        }
    }
}

// ===== FUNCIONES DEL MODAL =====
function mostrarModalEliminar(nombreArchivo, id) {
    archivoAEliminar = { nombre: nombreArchivo, id: id };
    document.getElementById('deleteFileName').textContent = nombreArchivo;
    document.getElementById('deleteConfirmModal').classList.remove('hidden');
    document.getElementById('deleteModalContent').classList.remove('scale-95');
    document.getElementById('deleteModalContent').classList.add('scale-100');
}

function closeDeleteModal() {
    document.getElementById('deleteModalContent').classList.add('scale-95');
    document.getElementById('deleteModalContent').classList.remove('scale-100');
    setTimeout(() => {
        document.getElementById('deleteConfirmModal').classList.add('hidden');
    }, 300);
}

// ===== FUNCIONES DE UI =====
function mostrarExito(mensaje) {
    const successMsg = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    successText.textContent = mensaje;
    successMsg.classList.remove('hidden');
    setTimeout(() => successMsg.classList.add('hidden'), 3000);
}
// ===== FUNCIÓN PARA MOSTRAR MENSAJES INFORMATIVOS =====
function mostrarInfo(mensaje) {
    // Verificar si existe el elemento, si no, crearlo
    let infoMsg = document.getElementById('infoMessage');

    if (!infoMsg) {
        // Crear el elemento si no existe
        infoMsg = document.createElement('div');
        infoMsg.id = 'infoMessage';
        infoMsg.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hidden z-50 transition-all duration-300 animate-fade-in';
        infoMsg.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="fa-solid fa-info-circle"></i>
                <span id="infoText"></span>
            </div>
        `;
        document.body.appendChild(infoMsg);
    }

    const infoText = document.getElementById('infoText');
    infoText.textContent = mensaje;
    infoMsg.classList.remove('hidden');

    setTimeout(() => {
        infoMsg.classList.add('hidden');
    }, 3000);
}
function mostrarError(mensaje) {
    const errorMsg = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    errorText.textContent = mensaje;
    errorMsg.classList.remove('hidden');
    setTimeout(() => errorMsg.classList.add('hidden'), 3000);
}

// ===== INICIALIZACIÓN =====
window.onload = function () {
    document.getElementById('temasCount').textContent = '0 temas';
    document.getElementById('scrollInfo').textContent = '0 visibles';

    actualizarHeaderCounts();
    cargarArchivosExcel();

    if (!localStorage.getItem('token')) {
        window.location.href = '/';
    }
};