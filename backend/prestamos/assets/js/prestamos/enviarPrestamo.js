/**
 * Archivo: enviarSolicitud.js
 * Descripción: Script para manejar el envío del formulario de solicitud mediante fetch
 */

const API_BASE_SOLICITUD = 'http://localhost/SGI-ProyectoFormativo/backend';
const CREAR_SOLICITUD_ENDPOINT = `${API_BASE_SOLICITUD}/prestamos/api/generarPrestamo.php`;

document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('solicitudForm');

    if (formulario) {
        // Prevenir el envío tradicional del formulario
        formulario.addEventListener('submit', function (event) {
            event.preventDefault();
            enviarSolicitud();
        });
    }
});

/**
 * Función para enviar la solicitud mediante fetch
 */
async function enviarSolicitud() {
    try {
        mostrarCargando(true);

        const formElement = document.getElementById('solicitudForm');
        const formData = new FormData(formElement);

        // Objeto final para almacenar los datos estructurados
        const datosFormulario = {};

        // Procesar cada entrada de FormData
        for (let [key, value] of formData.entries()) {
            if (key.startsWith('devolutivos') || key.startsWith('consumibles')) {
                // Claves como "devolutivos[123][cantidad]"
                const keys = key.match(/([^\[\]]+)/g); // Extrae por ejemplo: ['devolutivos', '123', 'cantidad']
                let ref = datosFormulario;

                for (let i = 0; i < keys.length - 1; i++) {
                    const k = keys[i];
                    if (!ref[k]) ref[k] = {};
                    ref = ref[k];
                }

                const lastKey = keys[keys.length - 1];
                if (!ref[lastKey]) {
                    ref[lastKey] = value;
                } else if (Array.isArray(ref[lastKey])) {
                    ref[lastKey].push(value);
                } else {
                    ref[lastKey] = [ref[lastKey], value];
                }

            } else if (key === 'observaciones') {
                // Manejar observaciones como array
                if (!datosFormulario.observaciones) {
                    datosFormulario.observaciones = [];
                }
                datosFormulario.observaciones.push(value);

            } else {
                // Campos normales
                datosFormulario[key] = value;
            }
        }

        // Realizar la petición
        const response = await fetch(CREAR_SOLICITUD_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(datosFormulario),
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Error HTTP: ${response.status}`);
        }

        mostrarMensaje('success', 'Solicitud creada exitosamente', data.message);

        // Redirigir después de 2 segundos
        setTimeout(() => {
            window.location.href = 'prestamos.php?id=' + data.id_solicitud;
        }, 2000);
    } catch (error) {
        console.error('Error al enviar solicitud:', error);
        mostrarMensaje('danger', 'Error al crear la solicitud', error.message);
    } finally {
        mostrarCargando(false);
    }
}

/**
 * Función para mostrar mensajes al usuario
 */
function mostrarMensaje(tipo, titulo, mensaje) {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
    alerta.innerHTML = `
        <strong>${titulo}</strong> ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    const formulario = document.getElementById('solicitudForm');
    formulario.parentNode.insertBefore(alerta, formulario);

    setTimeout(() => {
        alerta.remove();
    }, 5000);
}

/**
 * Función para mostrar/ocultar el indicador de carga en el botón
 */
function mostrarCargando(mostrar) {
    const botonSubmit = document.querySelector('button[type="submit"]');

    if (mostrar) {
        botonSubmit.disabled = true;
        botonSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';
    } else {
        botonSubmit.disabled = false;
        botonSubmit.innerHTML = 'Generar Préstamo';
    }
}