<?php
require_once '../controllers/CM_Controller.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Obtener datos del request
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['datos']) || !is_array($input['datos'])) {
        throw new Exception('No se han enviado datos válidos');
    }

    $controller = new CM_Controller();
    $resultado = $controller->comprobarDatos($input['datos']);

    if ($resultado['success']) {
        echo json_encode([
            'success' => true,
            'duplicados_bd' => $resultado['duplicados_bd'],
            'errores' => $resultado['errores'],
            'message' => 'Datos verificados exitosamente'
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