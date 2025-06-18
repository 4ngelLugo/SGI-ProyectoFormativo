$(document).ready(function () {
    // Select2 para selección múltiple de devolutivos y consumibles
    $('#selector_elemento_devolutivo').select2({
        placeholder: "Buscar elementos devolutivos por nombre...",
        allowClear: true
    });
    $('#selector_elemento_consumible').select2({
        placeholder: "Buscar elementos consumibles por nombre...",
        allowClear: true
    });

    obtenerElementos()
        .then(data => {
            data.forEach(elemento => {
                const mappedElemento = {
                    elemento_codigo: elemento.codigo,
                    elemento_nombre: elemento.nombre,
                    elemento_tipo: elemento.tipo,
                    elemento_placa: elemento.placa || '',
                    elemento_serial: elemento.serial || '',
                    elemento_modelo: elemento.modelo || '',
                    elemento_cantidad: elemento.cantidad || 0,
                    marca_id: elemento.marca || '',
                    area_id: elemento.area || '',
                    categoria_id: elemento.categoria || '',
                    elemento_und_medida: elemento.unidadMedida || ''
                };
                const option = new Option(mappedElemento.elemento_nombre, mappedElemento.elemento_codigo, false, false);
                $(option).attr('data-obj', JSON.stringify(mappedElemento));
                if (mappedElemento.elemento_tipo === 'devolutivo') {
                    $('#selector_elemento_devolutivo').append(option);
                } else if (mappedElemento.elemento_tipo === 'consumible') {
                    $('#selector_elemento_consumible').append(option);
                }
            });
            $('#selector_elemento_devolutivo, #selector_elemento_consumible').trigger('change');
        })
        .catch(error => {
            console.error('Error al cargar elementos:', error);
        });

    // Mostrar campos para cada devolutivo seleccionado
    $('#selector_elemento_devolutivo').on('change', function () {
        const selected = $(this).find('option:selected');
        let html = '';
        selected.each(function (i, opt) {
            const data = JSON.parse($(opt).attr('data-obj'));
            html += `
            <div class="card mb-2 p-2">
                <div class="row">
                    <div class="col-md-3">
                        <label class="form-label">Nombre:</label>
                        <input type="text" class="form-control" value="${data.elemento_nombre}" disabled>
                        <input type="hidden" name="devolutivos[]" value="${data.elemento_codigo}">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Cantidad:</label>
                        <input type="number" class="form-control" name="cantidades_devolutivos[]" min="1" max="${data.elemento_cantidad}" value="1">
                        <small class="text-muted">Máx: ${data.elemento_cantidad}</small>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Placa:</label>
                        <input type="text" class="form-control" value="${data.elemento_placa || ''}" disabled>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Serial:</label>
                        <input type="text" class="form-control" value="${data.elemento_serial || ''}" disabled>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Modelo:</label>
                        <input type="text" class="form-control" value="${data.elemento_modelo || ''}" disabled>
                    </div>
                </div>
            </div>
            `;
        });
        $('#devolutivosSeleccionados').html(html);
    });

    // Similar logic for consumibles
    $('#selector_elemento_consumible').on('change', function () {
        const selected = $(this).find('option:selected');
        let html = '';
        selected.each(function (i, opt) {
            const data = JSON.parse($(opt).attr('data-obj'));
            html += `
            <div class="card mb-2 p-2">
                <div class="row">
                    <div class="col-md-3">
                        <label class="form-label">Nombre:</label>
                        <input type="text" class="form-control" value="${data.elemento_nombre}" disabled>
                        <input type="hidden" name="consumibles[]" value="${data.elemento_codigo}">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Cantidad:</label>
                        <input type="number" class="form-control" name="cantidades_consumibles[]" min="1" max="${data.elemento_cantidad}" value="1">
                        <small class="text-muted">Máx: ${data.elemento_cantidad}</small>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Placa:</label>
                        <input type="text" class="form-control" value="${data.elemento_placa || ''}" disabled>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Serial:</label>
                        <input type="text" class="form-control" value="${data.elemento_serial || ''}" disabled>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Modelo:</label>
                        <input type="text" class="form-control" value="${data.elemento_modelo || ''}" disabled>
                    </div>
                </div>
            </div>
            `;
        });
        $('#consumiblesSeleccionados').html(html);
    });

    // Lógica de pasos
    let currentStep = 1;

    function showStep(step) {
        $('.form-step').addClass('d-none');
        $('.form-step-' + step).removeClass('d-none');
        $('.progress-step .step').removeClass('active');
        $('.progress-step .step-' + step).addClass('active');
    }
    $('.next-step').click(function () {
        if (validarPasoActual()) {
            if (currentStep < 3) {
                currentStep++;
                showStep(currentStep);
            }
        }
    });
    $('.prev-step').click(function () {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });

    function validarPasoActual() {
        let valido = true;
        $(`.form-step-${currentStep} [required]`).each(function() {
            if (!$(this).val()) {
                $(this).addClass('is-invalid');
                valido = false;
            } else {
                $(this).removeClass('is-invalid');
            }
        });
        if (!valido) {
            alert('Por favor complete todos los campos requeridos antes de continuar.');
        }
        return valido;
    }

    showStep(currentStep);

    // Configuración de fechas
    const hoy = new Date().toISOString().split('T')[0];
    $('#fecha_solicitud').val(hoy);
    
    if ($('#typeuser').val() === 'Almacenista') {
        $('#fecha_entrega').val(hoy).parent().hide();
    }
    
    // Fecha de devolución por defecto (7 días después), Podemos ajustarlo pero toca preguntar si se va a manejar esto con un por defecto
    const fechaDevolucion = new Date();
    fechaDevolucion.setDate(fechaDevolucion.getDate() + 7);
    $('#fecha_devolucion').val(fechaDevolucion.toISOString().split('T')[0]);
});