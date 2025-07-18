class CargaMasiva {
    constructor() {
        this.datos = [];
        this.datosFiltrados = [];
        this.duplicados = new Set();
        this.duplicadosBD = new Set();
        this.errores = new Map();
        this.datosComprobados = false;
        
        this.initEventListeners();
    }

    initEventListeners() {
        // Botón descargar plantilla
        document.getElementById('btn-descargar').addEventListener('click', () => {
            this.descargarPlantilla();
        });

        // Botón subir archivo
        document.getElementById('btn-subir').addEventListener('click', () => {
            document.getElementById('file-upload').click();
        });

        // Input de archivo
        document.getElementById('file-upload').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.subirArchivo(e.target.files[0]);
            }
        });

        // Botón comprobar/cargar
        document.getElementById('btn-comprobar').addEventListener('click', () => {
            if (this.datosComprobados) {
                this.cargarDatos();
            } else {
                this.comprobarDatos();
            }
        });

        // Filtros
        document.getElementById('filter-codigo').addEventListener('input', () => {
            this.aplicarFiltros();
        });

        document.getElementById('filter-nombre').addEventListener('input', () => {
            this.aplicarFiltros();
        });

        document.getElementById('btn-limpiar-filtros').addEventListener('click', () => {
            this.limpiarFiltros();
        });
    }

    async descargarPlantilla() {
        try {
            const response = await fetch('api/descargar_plantilla.php');
            const blob = await response.blob();
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'plantilla_elementos.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            this.mostrarMensaje('Plantilla descargada exitosamente', 'success');
        } catch (error) {
            this.mostrarMensaje('Error al descargar la plantilla', 'error');
        }
    }

    async subirArchivo(archivo) {
        if (!archivo.name.endsWith('.csv')) {
            this.mostrarMensaje('Por favor seleccione un archivo CSV válido', 'error');
            return;
        }

        this.mostrarLoading(true);
        
        const formData = new FormData();
        formData.append('archivo', archivo);

        try {
            const response = await fetch('api/subir_archivo.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                this.datos = result.datos;
                this.datosComprobados = false;
                this.procesarDatos();
                this.mostrarTabla();
                this.mostrarMensaje('Archivo cargado exitosamente', 'success');
            } else {
                this.mostrarMensaje(result.message || 'Error al procesar el archivo', 'error');
            }
        } catch (error) {
            this.mostrarMensaje('Error al subir el archivo', 'error');
        } finally {
            this.mostrarLoading(false);
        }
    }

    procesarDatos() {
        this.duplicados.clear();
        this.errores.clear();
        
        // Verificar duplicados internos
        const codigosVistos = new Map();
        
        this.datos.forEach((fila, index) => {
            const codigo = fila.elemento_codigo;
            
            if (codigosVistos.has(codigo)) {
                this.duplicados.add(index);
                this.duplicados.add(codigosVistos.get(codigo));
            } else {
                codigosVistos.set(codigo, index);
            }
        });

        this.actualizarEstadoBotones();
        this.actualizarContadores();
    }

    actualizarEstadoBotones() {
        const btnComprobar = document.getElementById('btn-comprobar');
        const btnIcon = btnComprobar.querySelector('i');
        
        if (this.datosComprobados && this.duplicados.size === 0 && this.duplicadosBD.size === 0 && this.errores.size === 0) {
            btnComprobar.textContent = 'Cargar Datos';
            btnComprobar.className = 'btn btn-success';
            btnComprobar.disabled = false;
            if (btnIcon) btnIcon.className = 'icon-upload';
        } else {
            btnComprobar.innerHTML = '<i class="icon-check"></i> Comprobar';
            btnComprobar.className = 'btn btn-success';
            btnComprobar.disabled = this.duplicados.size > 0;
        }
    }

    actualizarContadores() {
        document.getElementById('count-duplicados').textContent = this.duplicados.size;
        document.getElementById('count-bd-duplicados').textContent = this.duplicadosBD.size;
        document.getElementById('count-errores').textContent = this.errores.size;
    }

    mostrarTabla() {
        const statusPanel = document.getElementById('status-panel');
        const filtersPanel = document.getElementById('filters-panel');
        const tableContainer = document.getElementById('table-container');
        
        statusPanel.style.display = 'flex';
        filtersPanel.style.display = 'flex';
        tableContainer.style.display = 'block';
        
        this.datosFiltrados = [...this.datos];
        this.renderizarTabla();
    }

    renderizarTabla() {
        const tbody = document.getElementById('elementos-tbody');
        tbody.innerHTML = '';

        this.datosFiltrados.forEach((fila, index) => {
            const originalIndex = this.datos.indexOf(fila);
            const tr = document.createElement('tr');
            
            // Aplicar clases según el estado
            if (this.duplicados.has(originalIndex)) {
                tr.classList.add('row-duplicate');
            }
            if (this.duplicadosBD.has(originalIndex)) {
                tr.classList.add('row-db-duplicate');
            }
            if (this.errores.has(originalIndex)) {
                tr.classList.add('row-error');
            }

            tr.innerHTML = `
                <td class="editable-cell" data-field="elemento_codigo" data-index="${originalIndex}">${fila.elemento_codigo}</td>
                <td class="editable-cell" data-field="elemento_nombre" data-index="${originalIndex}">${fila.elemento_nombre}</td>
                <td class="editable-cell" data-field="elemento_tipo" data-index="${originalIndex}">${fila.elemento_tipo}</td>
                <td class="editable-cell" data-field="categoria_id" data-index="${originalIndex}">${fila.categoria_id}</td>
                <td class="editable-cell" data-field="area_id" data-index="${originalIndex}">${fila.area_id}</td>
                <td class="editable-cell" data-field="elemento_placa" data-index="${originalIndex}">${fila.elemento_placa}</td>
                <td class="editable-cell" data-field="elemento_serial" data-index="${originalIndex}">${fila.elemento_serial}</td>
                <td class="editable-cell" data-field="marca_id" data-index="${originalIndex}">${fila.marca_id}</td>
                <td class="editable-cell" data-field="elemento_modelo" data-index="${originalIndex}">${fila.elemento_modelo}</td>
                <td class="editable-cell" data-field="elemento_cantidad" data-index="${originalIndex}">${fila.elemento_cantidad}</td>
                <td class="editable-cell" data-field="elemento_und_medida" data-index="${originalIndex}">${fila.elemento_und_medida}</td>
                <td class="editable-cell" data-field="estado_elemento_id" data-index="${originalIndex}">${fila.estado_elemento_id}</td>
                <td class="status-cell">
                    ${this.getStatusIndicator(originalIndex)}
                </td>
            `;
            
            tbody.appendChild(tr);
        });

        // Agregar event listeners para edición inline
        document.querySelectorAll('.editable-cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                const field = e.target.dataset.field;
                this.editarCelda(e.target, index, field);
            });
        });
    }

    getStatusIndicator(index) {
        if (this.duplicados.has(index)) {
            return '<span class="status-indicator duplicate" title="Código duplicado">DUP</span>';
        }
        if (this.duplicadosBD.has(index)) {
            return '<span class="status-indicator db-duplicate" title="Código existe en BD">BD</span>';
        }
        if (this.errores.has(index)) {
            return '<span class="status-indicator error" title="Error de validación">ERR</span>';
        }
        return '<span class="status-indicator valid" title="Válido">OK</span>';
    }

    editarCelda(celda, index, field) {
        // Evitar edición múltiple
        if (celda.querySelector('input')) return;

        const valorActual = celda.textContent.trim();
        const input = document.createElement('input');
        input.type = 'text';
        input.value = valorActual;
        input.className = 'edit-input';
        input.style.width = '100%';
        input.style.border = '1px solid #007bff';
        input.style.padding = '4px';
        input.style.fontSize = '12px';
        
        celda.innerHTML = '';
        celda.appendChild(input);
        input.focus();
        input.select();

        const guardarCambio = () => {
            const nuevoValor = input.value.trim();
            this.datos[index][field] = nuevoValor;
            celda.textContent = nuevoValor;
            
            // Resetear estado de comprobación si se modifica algo
            this.datosComprobados = false;
            this.duplicadosBD.clear();
            this.errores.clear();
            
            this.procesarDatos();
            this.renderizarTabla();
        };

        const cancelarCambio = () => {
            celda.textContent = valorActual;
        };

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                guardarCambio();
            } else if (e.key === 'Escape') {
                cancelarCambio();
            }
        });

        input.addEventListener('blur', guardarCambio);
    }

    async comprobarDatos() {
        this.mostrarLoading(true);
        
        try {
            const response = await fetch('api/comprobar_datos.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ datos: this.datos })
            });

            const result = await response.json();
            
            if (result.success) {
                this.duplicadosBD = new Set(result.duplicados_bd);
                this.errores = new Map(Object.entries(result.errores));
                this.datosComprobados = true;
                
                this.actualizarContadores();
                this.actualizarEstadoBotones();
                this.renderizarTabla();
                
                if (this.duplicadosBD.size === 0 && this.errores.size === 0) {
                    this.mostrarMensaje('¡Todos los datos son válidos y están listos para ser cargados!', 'success');
                } else {
                    this.mostrarMensaje('Se encontraron algunos errores. Revise los elementos marcados.', 'warning');
                }
            } else {
                this.mostrarMensaje(result.message || 'Error al comprobar los datos', 'error');
            }
        } catch (error) {
            this.mostrarMensaje('Error al comprobar los datos', 'error');
        } finally {
            this.mostrarLoading(false);
        }
    }

    async cargarDatos() {
        // Filtrar solo los datos válidos (sin duplicados ni errores)
        const datosValidos = this.datos.filter((fila, index) => {
            return !this.duplicados.has(index) && 
                   !this.duplicadosBD.has(index) && 
                   !this.errores.has(index);
        });

        if (datosValidos.length === 0) {
            this.mostrarMensaje('No hay datos válidos para cargar', 'warning');
            return;
        }

        this.mostrarLoading(true);
        
        try {
            const response = await fetch('api/cargar_datos.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ datos: datosValidos })
            });

            const result = await response.json();
            
            if (result.success) {
                this.mostrarMensaje(`¡Carga completada! ${result.insertados} elementos insertados exitosamente.`, 'success');
                
                // Reiniciar el estado
                this.datos = [];
                this.datosFiltrados = [];
                this.duplicados.clear();
                this.duplicadosBD.clear();
                this.errores.clear();
                this.datosComprobados = false;
                
                // Ocultar paneles
                document.getElementById('status-panel').style.display = 'none';
                document.getElementById('filters-panel').style.display = 'none';
                document.getElementById('table-container').style.display = 'none';
                
                this.actualizarEstadoBotones();
                
            } else {
                this.mostrarMensaje(result.message || 'Error al cargar los datos', 'error');
            }
        } catch (error) {
            this.mostrarMensaje('Error al cargar los datos', 'error');
        } finally {
            this.mostrarLoading(false);
        }
    }

    aplicarFiltros() {
        const filtroCodigo = document.getElementById('filter-codigo').value.toLowerCase();
        const filtroNombre = document.getElementById('filter-nombre').value.toLowerCase();
        
        this.datosFiltrados = this.datos.filter(fila => {
            const coincideCodigo = fila.elemento_codigo.toLowerCase().includes(filtroCodigo);
            const coincideNombre = fila.elemento_nombre.toLowerCase().includes(filtroNombre);
            
            return coincideCodigo && coincideNombre;
        });
        
        this.renderizarTabla();
    }

    limpiarFiltros() {
        document.getElementById('filter-codigo').value = '';
        document.getElementById('filter-nombre').value = '';
        this.aplicarFiltros();
    }

    mostrarLoading(mostrar) {
        const loading = document.getElementById('loading');
        loading.style.display = mostrar ? 'block' : 'none';
    }

    mostrarMensaje(mensaje, tipo) {
        const messageDiv = document.getElementById('message');
        messageDiv.className = `message ${tipo}`;
        messageDiv.textContent = mensaje;
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Inicializar la aplicación
const cargaMasiva = new CargaMasiva();