<?php
require_once '../Model/Notificaciones.php';
require_once '../../config/Database.php';

class NotificacionController {
    private $model;
    

    public function __construct($usuario_id) {
        $database = new Database();
        $conn = $database->getConnection();
        $this->model = new Notificaciones($usuario_id, $conn);
    }

    public function getNotifications() {
        try {
            $notifications = $this->model->getAllNotifications();
            $unreadCount = $this->model->getUnreadCount();

            echo json_encode([
                'status' => 'success',
                'unread' => $unreadCount,
                'notifications' => $notifications
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Error al obtener notificaciones: ' . $e->getMessage()
            ]);
        }
    }

    public function markOneAsRead($notificationId) {
        try {
            $this->model->markOneAsRead($notificationId);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Error al marcar como leído: ' . $e->getMessage()
            ]);
            exit;
        }
    }

    public function deleteAllNotifications() {
        try {
            $this->model->deleteAllNotifications();
        } catch (Exception $e) {
            throw new Exception("No se pudieron borrar las notificaciones: " . $e->getMessage());
        }
    }
}

?>