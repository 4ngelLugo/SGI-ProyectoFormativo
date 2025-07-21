<?php
require_once '../Model/Notificaciones.php';
require_once '../../config/Database.php';

class NotificacionController
{
  private $model;

  public function __construct($rol_id)
  {
    $database = new Database();
    $conn = $database->connect();
    $this->model = new Notificaciones($rol_id, $conn);
  }

  public function getNotifications()
  {
    try {
      $notifications = $this->model->getAllNotifications();
      echo json_encode([
        'status' => 'success',
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

  public function deleteAllNotifications()
  {
    try {
      $this->model->deleteAllNotifications();
    } catch (Exception $e) {
      throw new Exception("No se pudieron borrar las notificaciones: " . $e->getMessage());
    }
  }
}
