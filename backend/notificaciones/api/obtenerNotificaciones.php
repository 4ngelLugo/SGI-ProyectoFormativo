<?php
require_once '../Controller/NotificacionController.php';
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['rol_id'])) {
        echo json_encode(['error' => 'Falta el rol_id']);
        exit;
    }

    $controller = new NotificacionController($data['rol_id']);
    $controller->getNotifications();
} else {
    echo json_encode(['error' => 'Método no permitido']);
}
