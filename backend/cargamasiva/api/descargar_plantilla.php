<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="plantilla_elementos.csv"');
header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
header('Content-Description: File Transfer');

// Encabezados de la plantilla
$headers = [
    'elemento_codigo',
    'elemento_nombre',
    'elemento_tipo',
    'categoria_id',
    'area_id',
    'elemento_placa',
    'elemento_serial',
    'marca_id',
    'elemento_modelo',
    'elemento_cantidad',
    'elemento_und_medida',
    'estado_elemento_id'
];

// Abrir output
$output = fopen('php://output', 'w');

// Escribir encabezados
fputcsv($output, $headers);

// Escribir fila de ejemplo
$ejemplo = [
    '099999',
    'Computadora Dell Inspiron',
    'devolutivo',
    '1',
    '1',
    '046501',
    'LL-123456789',
    '1',
    'Inspiron 15 3000',
    '1',
    'Unidad',
    '1'
];

fputcsv($output, $ejemplo);

// Escribir más ejemplos
$ejemplos = [
    ['1165020', 'Mouse Logitech', 'devolutivo', '2', '1', '356253', 'MS-987654321', '2', '3', '1', 'Unidad', '1'],
    ['112346020', 'Monitor Samsung', 'consumible', '2', '2', '32562003', 'SCR-456789123', '3', '4', '1', 'Unidad', '1']
];

foreach ($ejemplos as $ejemplo) {
    fputcsv($output, $ejemplo);
}

fclose($output);
exit;