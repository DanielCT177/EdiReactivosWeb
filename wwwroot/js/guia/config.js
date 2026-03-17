// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================
const Config = {
    itemsPerPage: 5,
    itemsPerPageExcel: 5,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['application/pdf']
};

// ============================================
// VARIABLES GLOBALES
// ============================================
// PDF
let allFiles = [];
let pdfFilesMap = {};
let filteredFiles = [];
let currentPage = 1;

// WORD
let allWordFiles = [];
let filteredWordFiles = [];
let currentWordPage = 1;

// EXCEL
let allExcelFiles = [];
let filteredExcelFiles = [];
let currentExcelPage = 1;

// UTILS
let currentFileId = null;
let currentFileName = '';
let pendingDeleteId = null;
let pendingDeleteType = 'pdf'; // 'pdf', 'word', 'excel'