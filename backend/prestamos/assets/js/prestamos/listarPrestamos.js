document.addEventListener('DOMContentLoaded', function () {
    const tablaPrestamos = document.querySelector('#tablaPrestamos tbody');

    function obtenerPrestamos() {
        return fetch('http://localhost/SGI-ProyectoFormativo/backend/prestamos/api/listarPrestamos.php', {
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
        .catch(error => {
            console.error('Error al obtener préstamos:', error);
            return [];
        });
    }

    function renderizarPrestamos(prestamos) {
        tablaPrestamos.innerHTML = '';
        if (prestamos.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="8" class="text-center">No hay préstamos registrados.</td>`;
            tablaPrestamos.appendChild(row);
        } else {
            prestamos.forEach(prestamo => {
                estado = (prestamo.estado_prestamo_id === "2") ? 'Completado' : 'En curso';
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${prestamo.prestamo_id}</td>
                    <td>${prestamo.solicitante_documento}</td>
                    <td>${prestamo.prestamo_fecha_solicitud}</td>
                    <td>${prestamo.prestamo_fecha_entrega}</td>
                    <td>${prestamo.prestamo_fecha_devolucion}</td>
                    <td>${prestamo.prestamo_tipo}</td>
                    <td><span class="badge bg-success">${estado}</span></td>
                    <td><button class="btn btn-info">Detalles</button></td>
                `;
                tablaPrestamos.appendChild(row);
            });
        }
    }

    obtenerPrestamos().then(data => {
        console.log('Datos recibidos:', data);
        renderizarPrestamos(data);
    });
});