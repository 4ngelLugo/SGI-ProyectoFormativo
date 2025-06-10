<?php
session_start();
$_SESSION['user_id'] = 1; // Simulación de usuario autenticado
$_SESSION['typeuser'] = 'Almacenista'; // Simulación de tipo de usuario
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Ver Préstamos</title>
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

        table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
        }

        thead {
            background: #e9ecef;
        }

        th,
        td {
            padding: 10px 8px;
            border: 1px solid #dee2e6;
            text-align: center;
        }

        th {
            color: #333;
            font-weight: bold;
        }

        tr:nth-child(even) {
            background: #f6f8fa;
        }

        .badge {
            display: inline-block;
            padding: 0.35em 0.7em;
            font-size: 0.85em;
            border-radius: 0.5em;
            color: #fff;
        }

        .bg-warning {
            background: #ffc107;
            color: #333;
        }

        .bg-success {
            background: #198754;
        }

        .bg-danger {
            background: #dc3545;
        }

        .bg-secondary {
            background: #6c757d;
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
            transition: background 0.2s;
        }

        .btn-info {
            background: #0dcaf0;
        }

        .btn-primary {
            background: #0d6efd;
        }

        .btn-danger {
            background: #dc3545;
        }

        .btn-info:hover,
        .btn-primary:hover,
        .btn-danger:hover {
            opacity: 0.85;
        }

        .text-center {
            text-align: center;
        }

        #modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.35);
            z-index: 10000;
            display: none;
        }

        #modal-box {
            background: #fff;
            border-radius: 8px;
            max-width: 420px;
            margin: 80px auto 0 auto;
            padding: 28px 24px 18px 24px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
            position: relative;
        }

        #modal-box h3 {
            margin-top: 0;
            color: #0d6efd;
        }

        #modal-close {
            position: absolute;
            top: 10px;
            right: 14px;
            background: none;
            border: none;
            font-size: 1.3em;
            color: #888;
            cursor: pointer;
        }

        #modal-box label {
            display: block;
            margin-top: 10px;
            font-weight: bold;
        }

        #modal-box input,
        #modal-box select {
            width: 100%;
            padding: 6px 8px;
            margin-top: 4px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        #modal-actions {
            text-align: right;
            margin-top: 10px;
        }

        #modal-actions button {
            margin-left: 8px;
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>Préstamos Actuales</h2>
        <table id="tablaPrestamos">
            <thead>
                <tr>
                    <th>ID Préstamo</th>
                    <th>Identificación Solicitante</th>
                    <th>Fecha Solicitud</th>
                    <th>Fecha Entrega</th>
                    <th>Fecha Devolución</th>
                    <th>Tipo Préstamo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="8" class="text-center">No hay préstamos registrados.</td>
                </tr>
            </tbody>
        </table>
        <script src="assets/js/prestamos/listarPrestamos.js"></script>
        <!-- <script src="assets/js/prestamos/websocket.js"></script> -->
    </div>
    <div id="modal-overlay">
    <div id="modal-box">
        <button id="modal-close" onclick="cerrarModal()">&times;</button>
        <div id="modal-content"></div>
        <div id="modal-actions"></div>
    </div>
</div>
</body>

</html>