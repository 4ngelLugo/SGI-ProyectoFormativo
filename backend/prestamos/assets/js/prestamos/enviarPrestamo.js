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

        // Convertir FormData a objeto plano, soportando arrays y objetos anidados
        const datosFormulario = {};

        for (let [key, value] of formData.entries()) {
            // Soporte para campos tipo array (ej: devolutivos[123][cantidad])
            if (key.includes('[')) {
                const keys = key.split(/\[|\]/).filter(Boolean);
                let ref = datosFormulario;
                for (let i = 0; i < keys.length; i++) {
                    if (i === keys.length - 1) {
                        ref[keys[i]] = value;
                    } else {
                        if (!ref[keys[i]]) ref[keys[i]] = {};
                        ref = ref[keys[i]];
                    }
                }
            } else {
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
        botonSubmit.innerHTML = 'Generar Prestamo';
    }
}
