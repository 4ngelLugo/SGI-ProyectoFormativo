<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

$datos = json_decode(file_get_contents("php://input"), true);

if (!isset($datos['prestamo_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'ID de préstamo requerido']);
    exit;
}

require_once '../controllers/prestamosController.php';

try {
    $controller = new PrestamosController();
    $resultado = $controller->actualizarPrestamo($datos);
    
    if ($resultado) {
        echo json_encode(['success' => true, 'message' => 'Préstamo actualizado correctamente']);
    } else {
        echo json_encode(['success' => false, 'error' => 'No se pudo actualizar el préstamo']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>