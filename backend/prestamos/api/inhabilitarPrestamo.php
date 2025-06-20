<?php
require_once '../controllers/prestamosController.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

try {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['prestamo_id'])) {
        http_response_code(400);
        echo json_encode(['mensaje' => 'Datos incompletos']);
        exit;
    }

    $prestamo_id = $input['prestamo_id'];

    $resultado = PrestamosController::inhabilitarPrestamo($prestamo_id);

    if ($resultado) {
        echo json_encode(['mensaje' => 'Préstamo inhabilitado correctamente']);
    } else {
        http_response_code(500);
        echo json_encode(['mensaje' => 'No se pudo inhabilitar el préstamo']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['mensaje' => 'Error: ' . $e->getMessage()]);
}
?>