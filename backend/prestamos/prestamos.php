<?php
session_start();
$_SESSION['user_id'] = 123;
$_SESSION['typeuser'] = 'Instructor';
// Simulación de tipo de usuario para ejemplo
if (!isset($_SESSION['typeuser'])) $_SESSION['typeuser'] = 'Almacenista';
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crear solicitud de préstamo</title>
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f8f9fa;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 1100px;
            margin: 40px auto;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
            padding: 32px 24px;
        }

        h2 {
            margin-bottom: 24px;
            color: #0d6efd;
        }

        .selected-items {
            min-height: 100px;
            border: 1px solid #ccc;
            padding: 10px;
            margin-top: 10px;
            border-radius: 5px;
        }

        .item-badge {
            display: inline-block;
            background-color: #f0f0f0;
            padding: 5px 10px;
            margin: 5px;
            border-radius: 15px;
            cursor: pointer;
        }

        .section-title {
            background-color: #f8f9fa;
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 5px;
            border-left: 4px solid #0d6efd;
        }

        .select2-container--default .select2-selection--single {
            height: 38px;
            padding: 5px;
            border: 1px solid #ced4da;
        }

        .select2-container--default .select2-selection--single .select2-selection__arrow {
            height: 36px;
        }

        .progress-step {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }

        .progress-step .step {
            flex: 1;
            text-align: center;
            position: relative;
        }

        .progress-step .step:not(:last-child)::after {
            content: '';
            position: absolute;
            top: 50%;
            right: 0;
            width: 100%;
            height: 4px;
            background: #dee2e6;
            z-index: 0;
            transform: translateY(-50%);
        }

        .progress-step .step.active .circle {
            background: #0d6efd;
            color: #fff;
        }

        .progress-step .circle {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #dee2e6;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 5px;
            z-index: 1;
            position: relative;
        }

        .progress-step .step.active .label {
            font-weight: bold;
            color: #0d6efd;
        }

        .btn {
            display: inline-block;
            padding: 5px 14px;
            font-size: 0.95em;
            border: none;
            border-radius: 4px;
            margin: 0 2px;
            cursor: pointer;
            text-decoration: none;
            color: #fff;
            background: #0d6efd;
            transition: background 0.2s;
        }

        .btn-primary {
            background: #0d6efd;
        }

        .btn-secondary {
            background: #6c757d;
        }

        .btn-success {
            background: #198754;
        }

        .btn:hover {
            opacity: 0.85;
        }

        .form-label {
            font-weight: bold;
        }

        .form-control,
        textarea {
            width: 100%;
            padding: 7px 10px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            margin-bottom: 8px;
            font-size: 1em;
        }

        .d-flex {
            display: flex;
        }

        .justify-content-end {
            justify-content: flex-end;
        }

        .justify-content-between {
            justify-content: space-between;
        }

        .mb-3 {
            margin-bottom: 1rem;
        }

        .mb-4 {
            margin-bottom: 1.5rem;
        }

        .mt-4 {
            margin-top: 2rem;
        }

        .row {
            display: flex;
            flex-wrap: wrap;
            margin: 0 -8px;
        }

        .col-md-6,
        .col-md-12,
        .col-md-3,
        .col-md-2 {
            padding: 0 8px;
            box-sizing: border-box;
        }

        .col-md-6 {
            flex: 0 0 50%;
            max-width: 50%;
        }

        .col-md-12 {
            flex: 0 0 100%;
            max-width: 100%;
        }

        .col-md-3 {
            flex: 0 0 25%;
            max-width: 25%;
        }

        .col-md-2 {
            flex: 0 0 16.6667%;
            max-width: 16.6667%;
        }

        .card {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            margin-bottom: 10px;
            padding: 10px 12px;
        }

        .text-muted {
            color: #6c757d;
            font-size: 0.95em;
        }

        .d-none {
            display: none !important;
        }
    </style>
</head>

<body>
    <div class="container mt-4">
        <h2 class="mb-4">Crear Solicitud de Préstamo</h2>

        <!-- Campo fuera del formulario para mostrar el tipo de usuario -->
        <div class="mb-3">
            <label class="form-label">Tipo de usuario actual:</label>
            <input type="text" class="form-control" value="<?php echo htmlspecialchars($_SESSION['typeuser']); ?>"
                disabled>
            <input type="hidden" id="typeuser" value="<?php echo htmlspecialchars($_SESSION['typeuser']); ?>">
        </div>

        <!-- Línea de progreso -->
        <div class="progress-step mb-4">
            <div class="step step-1 active">
                <div class="circle">1</div>
                <div class="label">Solicitante</div>
            </div>
            <div class="step step-2">
                <div class="circle">2</div>
                <div class="label">Devolutivos</div>
            </div>
            <div class="step step-3">
                <div class="circle">3</div>
                <div class="label">Consumibles</div>
            </div>
        </div>

        <form id="solicitudForm" method="post">
            <!-- Paso 1: Información del Solicitante -->
            <div class="form-step form-step-1">
                <div class="section-title">
                    <h4>Información del Solicitante</h4>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <input type="hidden" name="usertype" id="usertype" value="<?php echo $_SESSION['typeuser']; ?>">
                        <div class="mb-3">
                            <label for="id_usuario" class="form-label">ID Usuario:</label>
                            <input type="number" class="form-control" id="id_usuario" name="id_usuario" required
                                value="<?php echo $_SESSION['user_id']; ?>">
                        </div>
                        <div class="mb-3">
                            <label for="identificacion" class="form-label">Identificación del Solicitante:</label>
                            <input type="number" class="form-control" id="identificacion" name="identificacion" required>
                        </div>
                        <div class="mb-3">  
                            <label for="nombre_apellido" class="form-label">Nombre y Apellido del Solicitante:</label>
                            <input type="text" class="form-control" id="nombre_apellido" name="nombre_apellido" required>
                        </div>
                        <div class="mb-3">
                            <label for="direccion" class="form-label">Dirección del Solicitante:</label>
                            <input type="text" class="form-control" id="direccion" name="direccion" required>
                        </div>
                        <div class="mb-3">
                            <label for="destino_general" class="form-label">Destino:</label>
                            <input type="text" class="form-control" id="destino_general" name="destino_general" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="telefono" class="form-label">Teléfono del Solicitante:</label>
                            <input type="tel" class="form-control" id="telefono" name="telefono" required>
                        </div>
                        <div class="mb-3">
                            <label for="correo" class="form-label">Correo del Solicitante:</label>
                            <input type="email" class="form-control" id="correo" name="correo" required>
                        </div>
                        <div class="mb-3">
                            <label for="fecha_solicitud" class="form-label">Fecha Solicitud:</label>
                            <input type="date" class="form-control" id="fecha_solicitud" name="fecha_solicitud" required>
                        </div>
                        <div class="mb-3 fecha-entrega-group">
                            <label for="fecha_entrega" class="form-label">Fecha Entrega:</label>
                            <input type="date" class="form-control" id="fecha_entrega" name="fecha_entrega" required>
                        </div>
                        <div class="mb-3">
                            <label for="fecha_devolucion" class="form-label">Fecha Devolución:</label>
                            <input type="date" class="form-control" id="fecha_devolucion" name="fecha_devolucion" required>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-primary next-step">Siguiente</button>
                </div>
            </div>

            <!-- Paso 2: Devolutivos -->
            <div class="form-step form-step-2 d-none">
                <div class="section-title">
                    <h4>Información de los Elementos Devolutivos</h4>
                </div>
                <div class="row mb-3">
                    <div class="col-md-12 mb-3">
                        <label for="selector_elemento_devolutivo" class="form-label">Buscar y Seleccionar Elementos Devolutivos:</label>
                        <select class="form-select" id="selector_elemento_devolutivo" multiple style="width: 100%">
                            <option value="">Buscar elementos devolutivos por nombre...</option>
                        </select>
                    </div>
                </div>
                <div id="devolutivosSeleccionados"></div>
                <div class="d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary prev-step">Anterior</button>
                    <button type="button" class="btn btn-primary next-step">Siguiente</button>
                </div>
            </div>

            <!-- Paso 3: Consumibles -->
            <div class="form-step form-step-3 d-none">
                <div class="section-title">
                    <h4>Información de los Elementos Consumibles</h4>
                </div>
                <div class="row mb-3">
                    <div class="col-md-12 mb-3">
                        <label for="selector_elemento_consumible" class="form-label">Buscar y Seleccionar Elementos Consumibles:</label>
                        <select class="form-select" id="selector_elemento_consumible" multiple style="width: 100%">
                            <option value="">Buscar elementos consumibles por nombre...</option>
                        </select>
                    </div>
                </div>
                <div id="consumiblesSeleccionados"></div>
                <div class="mb-3">
                    <label for="observaciones" class="form-label">Observaciones:</label>
                    <textarea class="form-control" id="observaciones" name="observaciones" rows="3"></textarea>
                </div>
                <div class="d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary prev-step">Anterior</button>
                    <button type="submit" class="btn btn-success">Crear Solicitud</button>
                </div>
            </div>
        </form>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="assets/js/prestamos/dataElementos.js"></script>
    <script src="assets/js/prestamos/mostrarElementos.js"></script>
    <script src="assets/js/prestamos/enviarPrestamo.js" defer></script>
    <script src="assets/js/prestamos/obtenerSolicitante.js"></script>
</body>

</html>