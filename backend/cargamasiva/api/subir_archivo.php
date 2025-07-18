<?php
require_once '../controllers/CM_Controller.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Verificar que se envió un archivo
    if (!isset($_FILES['archivo'])) {
        throw new Exception('No se ha enviado ningún archivo');
    }

    $archivo = $_FILES['archivo'];
    
    // Verificar errores de upload
    if ($archivo['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Error al subir el archivo: ' . $archivo['error']);
    }

    // Verificar que es un archivo CSV
    $extension = pathinfo($archivo['name'], PATHINFO_EXTENSION);
    if (strtolower($extension) !== 'csv') {
        throw new Exception('El archivo debe ser un CSV');
    }

    // Verificar tamaño del archivo, se puede adaptar segun necesidades de los clientes, PREGUNTAR CON LOS INSTRUCTORES.
    if ($archivo['size'] > 10 * 1024 * 1024) {
        throw new Exception('El archivo es demasiado grande (máximo 10MB)');
    }

    $controller = new CM_Controller();
    $resultado = $controller->procesarArchivoCSV($archivo['tmp_name']);

    if ($resultado['success']) {
        echo json_encode([
            'success' => true,
            'message' => 'Archivo procesado exitosamente',
            'datos' => $resultado['datos'],
            'total_filas' => count($resultado['datos'])
        ]);
    } else {
        throw new Exception($resultado['message']);
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}