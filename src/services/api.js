import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

/**
 * Compare two PDF files
 * @param {File} fileBefore - The BEFORE/baseline PDF file
 * @param {File} fileAfter - The AFTER/modified PDF file
 * @returns {Promise} - Comparison results
 */
export const comparePDFs = async (fileBefore, fileAfter) => {
    const formData = new FormData();
    formData.append('file_before', fileBefore);
    formData.append('file_after', fileAfter);

    const response = await api.post('/api/compare', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

/**
 * Get download URL for highlighted PDF
 * @param {string} fileType - Either 'before' or 'after'
 * @param {string} filename - Name of the file
 * @returns {string} - Download URL
 */
export const getDownloadUrl = (fileType, filename) => {
    return `${API_BASE_URL}/api/download/${fileType}/${filename}`;
};

/**
 * Health check
 * @returns {Promise} - Health status
 */
export const healthCheck = async () => {
    const response = await api.get('/api/health');
    return response.data;
};

export default api;
