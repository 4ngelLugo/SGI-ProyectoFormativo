<?php
require_once __DIR__ . '/../../config/Database.php';
class Notificaciones {
    private $rol_id;
    private $conn;

    public function __construct($rol_id, $dbConnection) {
        $this->rol_id = $rol_id;
        $this->conn = $dbConnection;
    }

    public function getAllNotifications() {
        $stmt = $this->conn->prepare("SELECT * FROM notificaciones WHERE rol_id = ? ORDER BY fecha_notificacion DESC");
        $stmt->bind_param("i", $this->rol_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $notifications = [];
        while ($row = $result->fetch_assoc()) {
            $notifications[] = $row;
        }
        return $notifications;
    }

    public function deleteAllNotifications() {
        $stmt = $this->conn->prepare("DELETE FROM notificaciones WHERE rol_id = ?");
        $stmt->bind_param("i", $this->rol_id);
        $stmt->execute();
    }

    public function __destruct() {
        $this->conn->close();
    }
}
