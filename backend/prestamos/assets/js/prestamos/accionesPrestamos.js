document.addEventListener('DOMContentLoaded', function () {
    const tablaPrestamos = document.querySelector('#tablaPrestamos tbody');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const modalActions = document.getElementById('modal-actions');
    const modalClose = document.getElementById('modal-close');

    // Cargar préstamos
    obtenerPrestamos().then(data => {
        renderizarPrestamos(data);
    });

    // Funciones principales
    function obtenerPrestamos() {
        return fetch('http://localhost/SGI-ProyectoFormativo/backend/prestamos/api/listarPrestamos.php')
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar préstamos');
                return response.json();
            })
            .catch(error => {
                console.error(error);
                return [];
            });
    }

    function renderizarPrestamos(prestamos) {
        tablaPrestamos.innerHTML = '';
        if (prestamos.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="8" class="text-center">No hay préstamos registrados.</td>`;
            tablaPrestamos.appendChild(row);
            return;
        }

        prestamos.forEach(prestamo => {
            const estadoClase = obtenerClaseEstado(prestamo.estado_prestamo_nombre);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${prestamo.prestamo_id}</td>
                <td>${prestamo.solicitante_documento}</td>
                <td>${prestamo.prestamo_fecha_solicitud}</td>
                <td>${prestamo.prestamo_fecha_entrega}</td>
                <td>${prestamo.prestamo_fecha_devolucion}</td>
                <td>${prestamo.prestamo_tipo}</td>
                <td><span class="badge ${estadoClase}">${prestamo.estado_prestamo_nombre}</span></td>
                <td class="text-center">
                    <button class="btn btn-info btn-sm" onclick="mostrarDetalles('${prestamo.prestamo_id}')">Ver</button>
                    <button class="btn btn-primary btn-sm" onclick="editarPrestamo('${prestamo.prestamo_id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarPrestamo('${prestamo.prestamo_id}')">Eliminar</button>
                </td>
            `;
            tablaPrestamos.appendChild(row);
        });
    }

    // Mostrar detalles del préstamo
    window.mostrarDetalles = function (id) {
        fetch(`http://localhost/SGI-ProyectoFormativo/backend/prestamos/api/obtenerPrestamoCompleto.php?prestamo_id=${id}`)
            .then(response => response.json())
            .then(data => {
                const prestamo = data.prestamo;
                const solicitante = data.solicitante;
                const devolutivos = data.devolutivos;
                const consumibles = data.consumibles;

                // Estado con clase adecuada
                const estadoClase = obtenerClaseEstado(prestamo.estado_prestamo_nombre);

                // Construir HTML
                let html = `
                    <h3>Detalles del Préstamo #${prestamo.prestamo_id}</h3>
    
                    <!-- Datos del préstamo -->
                    <div class="card mb-4">
                        <div class="card-header bg-primary text-white">Datos del Préstamo</div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">ID Usuario:</label>
                                    <p class="form-control-plaintext">${prestamo.usuario_documento}</p>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">ID Solicitante:</label>
                                    <p class="form-control-plaintext">${prestamo.solicitante_documento}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Tipo de Préstamo:</label>
                                    <p class="form-control-plaintext">${prestamo.prestamo_tipo}</p>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Fecha Solicitud:</label>
                                    <p class="form-control-plaintext">${prestamo.prestamo_fecha_solicitud}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Fecha Entrega:</label>
                                    <p class="form-control-plaintext">${prestamo.prestamo_fecha_entrega}</p>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Fecha Devolución:</label>
                                    <p class="form-control-plaintext">${prestamo.prestamo_fecha_devolucion}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Destino:</label>
                                    <p class="form-control-plaintext">${prestamo.prestamo_destino}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Observaciones:</label>
                                    <p class="form-control-plaintext">${prestamo.prestamo_observacion || 'N/A'}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Estado:</label>
                                    <p class="form-control-plaintext">
                                        <span class="badge ${estadoClase}">${prestamo.estado_prestamo_nombre}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <!-- Datos del solicitante -->
                    <div class="card mb-4">
                        <div class="card-header bg-info text-white">Datos del Solicitante</div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Nombre:</label>
                                    <p class="form-control-plaintext">${solicitante.solicitante_nombre}</p>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Documento:</label>
                                    <p class="form-control-plaintext">${solicitante.solicitante_documento}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Correo:</label>
                                    <p class="form-control-plaintext">${solicitante.solicitante_correo}</p>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Teléfono:</label>
                                    <p class="form-control-plaintext">${solicitante.solicitante_telefono}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Dirección:</label>
                                    <p class="form-control-plaintext">${solicitante.solicitante_direccion}</p>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <!-- Elementos -->
                    <div class="card mb-4">
                        <div class="card-header bg-success text-white">Elementos del Préstamo</div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <h5>Devolutivos</h5>
                                    ${devolutivos.length > 0
                        ? `<ul class="list-group">${devolutivos.map(el => `<li class="list-group-item">${el.elemento_nombre} (${el.elemento_codigo})</li>`).join('')}</ul>`
                        : `<p class="text-muted">No hay devolutivos asignados.</p>`
                    }
                                </div>
                                <div class="col-md-6">
                                    <h5>Consumibles</h5>
                                    ${consumibles.length > 0
                        ? `<ul class="list-group">${consumibles.map(el => `<li class="list-group-item">${el.elemento_nombre} (${el.elemento_codigo})</li>`).join('')}</ul>`
                        : `<p class="text-muted">No hay consumibles asignados.</p>`
                    }
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                modalContent.innerHTML = html;
                modalActions.innerHTML = `<button class="btn btn-secondary" onclick="cerrarModal()">Cerrar</button>`;
                modalOverlay.style.display = 'block';
            })
            .catch(err => {
                alert('Error al obtener detalles: ' + err.message);
            });
    }

    // Eliminar préstamo (inhabilitar)
    window.eliminarPrestamo = function (id) {
        if (!confirm('¿Está seguro de eliminar este préstamo?')) return;

        fetch('http://localhost/SGI-ProyectoFormativo/backend/prestamos/api/inhabilitarPrestamo.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prestamo_id: id })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Préstamo eliminado correctamente');
                    location.reload();
                } else {
                    alert('Error al eliminar: ' + (data.error || 'Desconocido'));
                }
            });
    }

    // Editar préstamo
    window.editarPrestamo = function (id) {
        fetch(`http://localhost/SGI-ProyectoFormativo/backend/prestamos/api/obtenerPrestamoCompleto.php?prestamo_id=${id}`)
            .then(response => response.json())
            .then(data => {
                const prestamo = data.prestamo;
                const solicitante = data.solicitante;

                modalContent.innerHTML = '';

                // HTML del formulario
                let html = `
                    <h3>Editar Préstamo #${prestamo.prestamo_id}</h3>
    
                    <!-- Datos del préstamo -->
                    <div class="mb-3">
                        <label class="form-label">ID Usuario:</label>
                        <input type="text" class="form-control" id="usuario_documento" value="${prestamo.usuario_documento}" readonly>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Documento del Solicitante:</label>
                        <input type="text" class="form-control" id="solicitante_documento" value="${prestamo.solicitante_documento}" readonly>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Tipo de Préstamo:</label>
                        <select class="form-control" id="prestamo_tipo">
                            <option value="reserva" ${prestamo.prestamo_tipo === 'reserva' ? 'selected' : ''}>Reserva</option>
                            <option value="prestamo_inmediato" ${prestamo.prestamo_tipo === 'prestamo_inmediato' ? 'selected' : ''}>Préstamo Inmediato</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Fecha Solicitud:</label>
                        <input type="date" class="form-control" id="fecha_solicitud" value="${prestamo.prestamo_fecha_solicitud}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Fecha Entrega:</label>
                        <input type="date" class="form-control" id="fecha_entrega" value="${prestamo.prestamo_fecha_entrega}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Fecha Devolución:</label>
                        <input type="date" class="form-control" id="fecha_devolucion" value="${prestamo.prestamo_fecha_devolucion}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Destino:</label>
                        <input type="text" class="form-control" id="prestamo_destino" value="${prestamo.prestamo_destino}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Observaciones:</label>
                        <textarea class="form-control" id="observaciones">${prestamo.prestamo_observacion || ''}</textarea>
                    </div>
                    <!-- Elementos -->
                    <div class="mb-3">
                        <label class="form-label">Devolutivos:</label>
                        <select id="selector_devolutivos" multiple style="width:100%">
                            ${generarOpcionesElementos('devolutivo', data.todos_elementos, data.devolutivos)}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Consumibles:</label>
                        <select id="selector_consumibles" multiple style="width:100%">
                            ${generarOpcionesElementos('consumible', data.todos_elementos, data.consumibles)}
                        </select>
                    </div>
                `;

                modalContent.innerHTML = html;
                modalActions.innerHTML = `
                    <button class="btn btn-success" onclick="guardarEdicion('${prestamo.prestamo_id}')">Guardar Cambios</button>
                    <button class="btn btn-secondary" onclick="cerrarModal()">Cancelar</button>
                `;
                modalOverlay.style.display = 'block';

                // Inicializar Select2
                setTimeout(() => {
                    $('#selector_devolutivos').select2({
                        placeholder: "Selecciona devolutivos",
                        width: "100%",
                        dropdownParent: $('#modal-box'),
                        data: data.todos_elementos.filter(el => el.elemento_tipo === 'devolutivo')
                            .map(el => ({ id: el.elemento_codigo, text: `${el.elemento_nombre} (${el.elemento_codigo})` }))
                    }).val(data.devolutivos.map(el => el.elemento_codigo)).trigger('change');

                    $('#selector_consumibles').select2({
                        placeholder: "Selecciona consumibles",
                        width: "100%",
                        dropdownParent: $('#modal-box'), // 👈 Mismo ajuste para consumibles
                        data: data.todos_elementos.filter(el => el.elemento_tipo === 'consumible')
                            .map(el => ({ id: el.elemento_codigo, text: `${el.elemento_nombre} (${el.elemento_codigo})` }))
                    }).val(data.consumibles.map(el => el.elemento_codigo)).trigger('change');
                }, 100);
            })
            .catch(err => {
                alert('Error al cargar préstamo: ' + err.message);
            });
    }
    // Función para guardar edición
    window.guardarEdicion = function (id) {
        const datos = {
            prestamo_id: id,
            usuario_documento: document.getElementById('usuario_documento')?.value || '',
            solicitante_documento: document.getElementById('solicitante_documento')?.value || '',
            prestamo_tipo: document.getElementById('prestamo_tipo')?.value || '',
            prestamo_fecha_solicitud: document.getElementById('fecha_solicitud')?.value || '',
            prestamo_fecha_entrega: document.getElementById('fecha_entrega')?.value || '',
            prestamo_fecha_devolucion: document.getElementById('fecha_devolucion')?.value || '',
            prestamo_destino: document.getElementById('prestamo_destino')?.value || '',
            prestamo_observacion: document.getElementById('observaciones')?.value || '',
            devolutivos: $('#selector_devolutivos').val(),
            consumibles: $('#selector_consumibles').val()
        };

        fetch('http://localhost/SGI-ProyectoFormativo/backend/prestamos/api/actualizarPrestamo.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Préstamo actualizado correctamente');
                    cerrarModal();
                    location.reload();
                } else {
                    alert('Error: ' + (data.error || 'Desconocido'));
                }
            })
            .catch(err => {
                alert('Error de red: ' + err.message);
            });
    }
    // Generar opciones para Select2
    function generarOpcionesElementos(tipo, todos, seleccionados = []) {
        const seleccionadosSet = new Set(seleccionados.map(el => el.elemento_codigo));
        return todos
            .filter(el => el.elemento_tipo === tipo && !seleccionadosSet.has(el.elemento_codigo))
            .map(el => `
                <option value="${el.elemento_codigo}">
                    ${el.elemento_nombre} (${el.elemento_codigo})
                </option>
            `).join('');
    }

    // Cerrar modal
    window.cerrarModal = function () {
        modalOverlay.style.display = 'none';
        modalContent.innerHTML = '';
        modalActions.innerHTML = '';
    }

    // Cerrar modal con botón
    modalClose.addEventListener('click', cerrarModal);

    // Mapeo de estados a colores
    function obtenerClaseEstado(estado) {
        switch (estado) {
            case 'En curso':
                return 'bg-warning'; // amarillo
            case 'Atrasado':
                return 'bg-primary'; // verde
            case 'Completado':
                return 'bg-success'; // verde
            case 'Inhabilitado':
                return 'bg-danger'; // rojo
            default:
                return 'bg-secondary'; // gris
        }
    }
});