<?php
header("Content-Type: application/json");

require_once '../Controller/NotificacionController.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['user_id'])) {
        echo json_encode(['error' => 'Falta el user_id']);
        exit;
    }

    $controller = new NotificacionController($data['user_id']);
    $controller->getNotifications();
} else {
    echo json_encode(['error' => 'Método no permitido']);
}
?>