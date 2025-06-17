<?php
require_once '../controllers/prestamosController.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Método no permitido"]);
    exit();
}

$identificacion = $_GET['identificacion'] ?? '';

if (empty($identificacion)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Identificación requerida"]);
    exit();
}

try {
    $controller = new PrestamosController();
    $solicitante = $controller->obtenerSolicitante($identificacion);
    
    echo json_encode([
        "success" => true,
        "solicitante" => $solicitante
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>