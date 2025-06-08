document.addEventListener('DOMContentLoaded', function () {
    obtenerPrestamos().then(function (prestamos) {
        const tbody = document.querySelector('#tablaPrestamos tbody');
        tbody.innerHTML = ''; // Limpiar el contenido

        if (!prestamos || prestamos.length === 0) {
            tbody.innerHTML = `<tr>
                <td colspan="8" class="text-center">No hay préstamos registrados.</td>
            </tr>`;
            return;
        }

        prestamos.forEach(function (p) {
            let badge = 'bg-secondary';
            if (p.estado_prestamo_id == 1) badge = 'bg-warning';
            if (p.estado_prestamo_id == 2) badge = 'bg-success';
            if (p.estado_prestamo_id == 3) badge = 'bg-danger';

            tbody.innerHTML += `
                <tr>
                    <td>${p.prestamo_id}</td>
                    <td>${p.usuario_documento}</td>
                    <td>${p.prestamo_fecha_solicitud || ''}</td>
                    <td>${p.prestamo_fecha_entrega || ''}</td>
                    <td>${p.prestamo_fecha_devolucion || ''}</td>
                    <td>${p.tipo_prestamo || ''}</td>
                    <td><span class="badge ${badge}">${p.estado_nombre || ''}</span></td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick='verPrestamo(${JSON.stringify(p)})'>Ver</button>
                        <button class="btn btn-primary btn-sm" onclick='editarPrestamo(${JSON.stringify(p)})'>Editar</button>
                        <button class="btn btn-danger btn-sm" onclick='eliminarPrestamo("${p.prestamo_id}")'>Eliminar</button>
                    </td>
                </tr>
            `;
        });
    });
});

const ws = new WebSocket('ws://localhost:8082');
ws.onopen = function () {
    // Envía el rol al servidor WebSocket
    console.log('WebSocket conectado con éxito');
    ws.send(JSON.stringify({
        rol: 'Almacenista'
    }));
};
ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (data.tipo === 'reserva_nueva') {
        // Notificación emergente
        alert('Nueva solicitud de Reserva generada');
        // Opcional: recargar la tabla automáticamente
        recargarTablaPrestamos();
    }
};

// Notificaciones visuales y almacenamiento en localStorage

// Función para mostrar la notificación
function mostrarNotificacion(prestamo) {
    // Crear contenedor si no existe
    let contenedor = document.getElementById('notificaciones-contenedor');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'notificaciones-contenedor';
        contenedor.style.position = 'fixed';
        contenedor.style.top = '20px';
        contenedor.style.right = '20px';
        contenedor.style.zIndex = '9999';
        document.body.appendChild(contenedor);
    }

    // Crear notificación
    const noti = document.createElement('div');
    noti.className = 'notificacion-toast';
    noti.style.background = '#0d6efd';
    noti.style.color = '#fff';
    noti.style.padding = '16px 24px';
    noti.style.marginBottom = '10px';
    noti.style.borderRadius = '6px';
    noti.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    noti.style.fontSize = '16px';
    noti.innerHTML = `
        <strong>¡Nueva Reserva!</strong><br>
        Préstamo ID: ${prestamo.prestamo_id || 'N/A'}
    `;
    contenedor.appendChild(noti);

    // Eliminar después de 5 segundos
    setTimeout(() => {
        noti.remove();
    }, 5000);
}

// Guardar notificación en localStorage
function guardarNotificacion(prestamo) {
    let notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
    notificaciones.push({
        id: prestamo.prestamo_id,
        usuario: prestamo.usuario_documento,
        fecha: prestamo.fecha_solicitud,
        timestamp: Date.now()
    });
    localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
}

// Botón para mostrar todas las notificaciones
function crearBotonNotificaciones() {
    if (document.getElementById('btn-ver-notificaciones')) return;
    const btn = document.createElement('button');
    btn.id = 'btn-ver-notificaciones';
    btn.textContent = '🔔 Notificaciones';
    btn.style.position = 'fixed';
    btn.style.top = '20px';
    btn.style.left = '20px';
    btn.style.zIndex = '10000';
    btn.style.background = '#fff';
    btn.style.border = '1px solid #0d6efd';
    btn.style.color = '#0d6efd';
    btn.style.padding = '8px 16px';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.onclick = function () {
        let notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
        if (notificaciones.length === 0) {
            alert('No hay notificaciones guardadas.');
            return;
        }
        let html = '<strong>Notificaciones:</strong><ul style="padding-left:18px">';
        notificaciones.slice().reverse().forEach(n => {
            html += `<li><b>ID:</b> ${n.id} | <b>Usuario:</b> ${n.usuario} | <b>Fecha:</b> ${n.fecha || ''} | <b>Tipo:</b> ${n.tipo}</li>`;
        });
        html += '</ul>';
        // Mostrar en un modal simple
        let modal = document.getElementById('notificaciones-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'notificaciones-modal';
            modal.style.position = 'fixed';
            modal.style.top = '60px';
            modal.style.left = '50%';
            modal.style.transform = 'translateX(-50%)';
            modal.style.background = '#fff';
            modal.style.border = '1px solid #ccc';
            modal.style.padding = '20px';
            modal.style.zIndex = '10001';
            modal.style.maxWidth = '400px';
            modal.style.borderRadius = '8px';
            modal.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
            document.body.appendChild(modal);
        }
        modal.innerHTML = html + '<br><button onclick="document.getElementById(\'notificaciones-modal\').remove()">Cerrar</button>';
    };
    document.body.appendChild(btn);
}

function abrirModal(html, actionsHtml = '') {
    document.getElementById('modal-content').innerHTML = html;
    document.getElementById('modal-actions').innerHTML = actionsHtml;
    document.getElementById('modal-overlay').style.display = 'block';
}
function cerrarModal() {
    document.getElementById('modal-overlay').style.display = 'none';
}

// Función para mostrar datos en el modal
function verPrestamo(prestamo) {
    let html = `
        <h3>Detalle del Préstamo</h3>
        <label>ID Préstamo</label>
        <input type="text" value="${prestamo.prestamo_id}" readonly>
        <label>Identificación Solicitante</label>
        <input type="text" value="${prestamo.usuario_documento}" readonly>
        <label>Fecha Solicitud</label>
        <input type="text" value="${prestamo.prestamo_fecha_solicitud || ''}" readonly>
        <label>Fecha Entrega</label>
        <input type="text" value="${prestamo.prestamo_fecha_entrega || ''}" readonly>
        <label>Fecha Devolución</label>
        <input type="text" value="${prestamo.prestamo_fecha_devolucion || ''}" readonly>
        <label>Tipo Préstamo</label>
        <input type="text" value="${prestamo.tipo_prestamo || ''}" readonly>
        <label>Estado</label>
        <input type="text" value="${prestamo.estado_nombre || ''}" readonly>
    `;
    abrirModal(html, `<button class="btn btn-info" onclick="cerrarModal()">Cerrar</button>`);
}

// Función para editar
function editarPrestamo(prestamo) {
    let html = `
        <h3>Editar Préstamo</h3>
        <label>ID Préstamo</label>
        <input type="text" value="${prestamo.prestamo_id}" readonly>
        <label>Fecha Devolución</label>
        <input type="date" id="edit-fecha-devolucion" value="${prestamo.prestamo_fecha_devolucion ? prestamo.prestamo_fecha_devolucion.split('T')[0] : ''}">
        <label>Estado</label>
        <select id="edit-estado">
            <option value="1" ${prestamo.estado_prestamo_id == 1 ? 'selected' : ''}>En espera</option>
            <option value="2" ${prestamo.estado_prestamo_id == 2 ? 'selected' : ''}>Aprobado</option>
            <option value="3" ${prestamo.estado_prestamo_id == 3 ? 'selected' : ''}>Rechazado</option>
        </select>
    `;
    abrirModal(html, `
        <button class="btn btn-secondary" onclick="cerrarModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarEdicionPrestamo('${prestamo.prestamo_id}')">Guardar</button>
    `);
}

// Guardar edición (AJAX)
function guardarEdicionPrestamo(prestamo_id) {
    const fecha_devolucion = document.getElementById('edit-fecha-devolucion').value;
    const estado_id = document.getElementById('edit-estado').value;
    fetch('api/editarPrestamo.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            prestamo_id,
            fecha_devolucion,
            estado_prestamo_id: estado_id
        })
    })
    .then(res => res.json())
    .then(resp => {
        cerrarModal();
        recargarTablaPrestamos();
    })
    .catch(() => alert('Error al actualizar el préstamo'));
}

// Eliminar (inhabilitar)
function eliminarPrestamo(prestamo_id) {
    abrirModal(
        `<h3>Inhabilitar Préstamo</h3>
        <p>¿Está seguro de que desea inhabilitar este préstamo?</p>`,
        `<button class="btn btn-secondary" onclick="cerrarModal()">Cancelar</button>
         <button class="btn btn-danger" onclick="confirmarEliminarPrestamo('${prestamo_id}')">Inhabilitar</button>`
    );
}
function confirmarEliminarPrestamo(prestamo_id) {
    fetch('api/inhabilitarPrestamo.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ prestamo_id })
    })
    .then(res => res.json())
    .then(resp => {
        cerrarModal();
        obtenerPrestamos().then();
        recargarTablaPrestamos();
    })
    .catch(() => alert('Error al inhabilitar el préstamo'));
}

function recargarTablaPrestamos() {
    obtenerPrestamos().then(function (prestamos) {
        const tbody = document.querySelector('#tablaPrestamos tbody');
        tbody.innerHTML = ''; // Limpiar el contenido

        if (!prestamos || prestamos.length === 0) {
            tbody.innerHTML = `<tr>
                <td colspan="8" class="text-center">No hay préstamos registrados.</td>
            </tr>`;
            return;
        }

        prestamos.forEach(function (p) {
            let badge = 'bg-secondary';
            if (p.estado_prestamo_id == 1) badge = 'bg-warning';
            if (p.estado_prestamo_id == 2) badge = 'bg-success';
            if (p.estado_prestamo_id == 3) badge = 'bg-danger';

            tbody.innerHTML += `
                <tr>
                    <td>${p.prestamo_id}</td>
                    <td>${p.usuario_documento}</td>
                    <td>${p.prestamo_fecha_solicitud || ''}</td>
                    <td>${p.prestamo_fecha_entrega || ''}</td>
                    <td>${p.prestamo_fecha_devolucion || ''}</td>
                    <td>${p.tipo_prestamo || ''}</td>
                    <td><span class="badge ${badge}">${p.estado_nombre || ''}</span></td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick='verPrestamo(${JSON.stringify(p)})'>Ver</button>
                        <button class="btn btn-primary btn-sm" onclick='editarPrestamo(${JSON.stringify(p)})'>Editar</button>
                        <button class="btn btn-danger btn-sm" onclick='eliminarPrestamo("${p.prestamo_id}")'>Eliminar</button>
                    </td>
                </tr>
            `;
        });
    });
}

crearBotonNotificaciones();

// En tu ws.onmessage:
ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (data.tipo === 'reserva_nueva') {
        // Mostrar notificación visual
        mostrarNotificacion(data.datos);
        // Guardar en localStorage
        guardarNotificacion(data.datos);
        // Recargar la tabla
        recargarTablaPrestamos();
    }
}