<?php
require_once '../Controller/NotificacionController.php';
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Falta el user_id']);
    exit;
}

$userId = $data['user_id'];

try {
    $controller = new NotificacionController($userId);
    $controller->deleteAllNotifications();

    echo json_encode(['status' => 'success', 'message' => 'Notificaciones eliminadas correctamente']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error al eliminar notificaciones: ' . $e->getMessage()]);
}
?>