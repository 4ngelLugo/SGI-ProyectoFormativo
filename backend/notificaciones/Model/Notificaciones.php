<?php
require_once __DIR__ . '/../../config/Database.php';
class Notificaciones
{
    private $usuario_id;
    private $conn;

    public function __construct($usuario_id, $dbConnection)
    {
        $this->usuario_id = $usuario_id;
        $this->conn = $dbConnection;
    }

    // Obtener cantidad de notificaciones no leídas
    public function getUnreadCount()
    {
        $stmt = $this->conn->prepare("SELECT COUNT(*) AS count FROM notificaciones WHERE usuario_id = ? AND leido = 0");
        $stmt->bind_param("i", $this->usuario_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        return $row['count'];
    }

    // Obtener todas las notificaciones del usuario
    public function getAllNotifications()
    {
        $stmt = $this->conn->prepare("SELECT * FROM notificaciones WHERE usuario_id = ? ORDER BY fecha_notificacion DESC");
        $stmt->bind_param("i", $this->usuario_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $notifications = [];

        while ($row = $result->fetch_assoc()) {
            $notifications[] = $row;
        }

        return $notifications;
    }

    public function markAllAsRead()
    {
        $stmt = $this->conn->prepare("UPDATE notificaciones SET leido = 1 WHERE usuario_id = ? AND leido = 0");
        $stmt->bind_param("i", $this->usuario_id);
        return $stmt->execute();
    }

    public function markOneAsRead($notiId) {
        $stmt = $this->conn->prepare("UPDATE notificaciones SET leido = 1 WHERE notificacion_id = ? AND usuario_id = ?");
        $stmt->execute([$notiId, $this->usuario_id]);
    }

    public function deleteAllNotifications() {
        $stmt = $this->conn->prepare("DELETE FROM notificaciones WHERE usuario_id = ?");
        $stmt->execute([$this->usuario_id]);
    }

    public function __destruct()
    {
        $this->conn->close();
    }
}
