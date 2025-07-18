<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../controllers/CM_Controller.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }

    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['datos']) || !is_array($input['datos'])) {
        throw new Exception('Datos no válidos');
    }

    $controller = new CM_Controller();
    $resultado = $controller->guardarElementos($input['datos']);
    
    echo json_encode($resultado);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}