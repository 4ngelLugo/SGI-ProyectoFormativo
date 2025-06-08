<?php
require_once '../../config/Database.php';
require_once '../controllers/prestamosController.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar que sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit();
}

// Recibir toda la data enviada en el body
$datos = json_decode(file_get_contents("php://input"), true);

if (!$datos || !is_array($datos)) {
    http_response_code(400);
    echo json_encode(["error" => "Datos inválidos"]);
    exit;
}

$controller = new prestamosController();

try {
    // Pasar toda la data al método del controlador
    $resultado = $controller->crearSolicitud($datos);
    http_response_code(201);
    // error_log('[DEBUG] Datos recibidos en generarPrestamo.php: ' . json_encode($datos));
    echo json_encode([
        "success" => true,
        "id_solicitud" => $resultado,
        "message" => "Solicitud creada correctamente",
        "data_recibida" => $datos
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>