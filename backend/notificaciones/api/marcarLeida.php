<?php
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['user_id']) || !isset($data['notification_id'])) {
        echo json_encode(['error' => 'Datos incompletos']);
        exit;
    }

    $userId = $data['user_id'];
    $notiId = $data['notification_id'];

    require_once '../Controller/NotificacionController.php';
    $controller = new NotificacionController($userId);
    $controller->markOneAsRead($notiId);
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['error' => 'Método no permitido']);
}
?>