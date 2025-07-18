<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carga Masiva de Elementos</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Carga Masiva de Elementos</h1>
        </header>

        <div class="actions-panel">
            <div class="buttons-group">
                <button id="btn-descargar" class="btn btn-primary">
                    <i class="icon-download"></i> Descargar Plantilla
                </button>
                
                <div class="file-upload-wrapper">
                    <input type="file" id="file-upload" accept=".csv" style="display: none;">
                    <button id="btn-subir" class="btn btn-secondary">
                        <i class="icon-upload"></i> Subir Archivo CSV
                    </button>
                </div>
                
                <button id="btn-comprobar" class="btn btn-success" disabled>
                    <i class="icon-check"></i> Comprobar
                </button>
            </div>
        </div>

        <div class="status-panel" id="status-panel" style="display: none;">
            <div class="status-item">
                <span class="status-circle red"></span>
                <span class="status-text">Códigos repetidos: <span id="count-duplicados">0</span></span>
            </div>
            <div class="status-item">
                <span class="status-circle orange"></span>
                <span class="status-text">Códigos repetidos desde base de datos: <span id="count-bd-duplicados">0</span></span>
            </div>
            <div class="status-item">
                <span class="status-circle yellow"></span>
                <span class="status-text">Errores de validación: <span id="count-errores">0</span></span>
            </div>
        </div>

        <div class="filters-panel" id="filters-panel" style="display: none;">
            <div class="filter-group">
                <label for="filter-codigo">Filtrar por Código:</label>
                <input type="text" id="filter-codigo" placeholder="Ingrese código...">
            </div>
            <div class="filter-group">
                <label for="filter-nombre">Filtrar por Nombre:</label>
                <input type="text" id="filter-nombre" placeholder="Ingrese nombre...">
            </div>
            <button id="btn-limpiar-filtros" class="btn btn-outline">Limpiar Filtros</button>
        </div>

        <div class="table-container" id="table-container" style="display: none;">
            <div class="table-wrapper">
                <table id="elementos-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Categoría ID</th>
                            <th>Área ID</th>
                            <th>Placa</th>
                            <th>Serial</th>
                            <th>Marca ID</th>
                            <th>Modelo</th>
                            <th>Cantidad</th>
                            <th>Unidad Medida</th>
                            <th>Estado ID</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="elementos-tbody">
                    </tbody>
                </table>
            </div>
        </div>

        <div class="loading" id="loading" style="display: none;">
            <div class="spinner"></div>
            <p>Procesando archivo...</p>
        </div>

        <div class="message" id="message" style="display: none;"></div>
    </div>

    <script src="main.js"></script>
</body>
</html>