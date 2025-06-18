/**
 * Archivo: fetchSolicitudes.js
 * Descripción: Realiza peticiones a getLogic.php para obtener elementos
 */

// URL base para las peticiones
const API_BASE = 'http://localhost/SGI-ProyectoFormativo/backend';
const ELEMENTOS_ENDPOINT = `${API_BASE}/elementos/api/obtenerAPI.php`;

/**
 * Función para obtener todos los elementos
 * @returns {Promise<Array>} Promesa con los datos de los elementos (array de objetos)
 */
function obtenerElementos() {
    return fetch(ELEMENTOS_ENDPOINT, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'include' // Incluir cookies para la gestión de la sesión
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Si la respuesta es un objeto con clave 'data', devolver ese array, si no, devolver el array directamente
            if (Array.isArray(data)) {
                return data;
            } else if (data && Array.isArray(data.data)) {
                return data.data;
            } else {
                // Si la respuesta es un solo objeto, devolverlo en un array
                return [data];
            }
        })
        .catch(error => {
            console.error('Error al obtener elementos:', error);
            throw error;
        });
}

/**
 * Función para obtener un elemento por su código
 * @param {number|string} codigo - Código del elemento a buscar
 * @returns {Promise<Object>} Promesa con los datos del elemento
 */
function obtenerElementoPorCodigo(codigo) {
    const url = `${ELEMENTOS_ENDPOINT}?codigo=${codigo}`;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Si la respuesta es un objeto con los campos del elemento, devolverlo directamente
            // Si la respuesta es un objeto con clave 'data', devolver ese objeto
            if (data && data.elemento_codigo) {
                return data;
            } else if (data && data.data) {
                return data.data;
            } else {
                return null;
            }
        })
        .catch(error => {
            console.error(`Error al obtener elemento con código ${codigo}:`, error);
            throw error;
        });
}
