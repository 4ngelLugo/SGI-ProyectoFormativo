/**
 * Obtiene todos los préstamos desde la API y retorna un array de objetos
 * @returns {Promise<Array>}
 */
function obtenerPrestamos() {
    return fetch('api/listarPrestamos.php', {
        method: 'GET',
        headers: {
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
        // Si la respuesta es un array, la retorna directamente
        if (Array.isArray(data)) {
            return data;
        }
        // Si la respuesta es un objeto con clave 'data', retorna ese array
        if (data && Array.isArray(data.data)) {
            return data.data;
        }
        // Si la respuesta es un solo objeto, lo retorna en un array
        return [data];
    })
    .catch(error => {
        console.error('Error al obtener préstamos:', error);
        return [];
    });
}