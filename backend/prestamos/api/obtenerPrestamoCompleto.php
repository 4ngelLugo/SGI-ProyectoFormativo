<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

$prestamo_id = $_GET['prestamo_id'] ?? '';

if (empty($prestamo_id)) {
    http_response_code(400);
    echo json_encode(['error' => 'ID de préstamo requerido']);
    exit;
}

require_once '../controllers/prestamosController.php';

try {
    $controller = new PrestamosController();
    $resultado = $controller->obtenerPrestamoCompleto($prestamo_id);
    
    echo json_encode($resultado);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>