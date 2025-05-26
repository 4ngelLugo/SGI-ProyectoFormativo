<?php
class AreaModel
{
  private $conn;
  public $table = "areas";

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function guardarArea($nombre)
  {
    $query = "INSERT INTO {$this->table} (area_nombre) VALUES (?)";
    $stmt = $this->conn->prepare($query);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    $stmt->bind_param("s", $nombre);

    if ($stmt->execute()) return true;

    // Registrar error en archivo
    $this->logError("Execute failed (Guardar área): " . $stmt->error);
    return null;
  }

  public function obtenerTodasLasAreas($estado = "activo")
  {
    $query = "SELECT * FROM {$this->table} WHERE area_estado = ?";
    $stmt = $this->conn->prepare($query);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    $stmt->bind_param("s", $estado);

    if ($stmt->execute()) {
      $result = $stmt->get_result();
      return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Registrar error en archivo
    $this->logError("Execute failed (Obtener todas las áreas): " . $stmt->error);
    return null;
  }

  public function obtenerAreaPorId($id)
  {
    $query = "SELECT * FROM {$this->table} WHERE area_id = ?";
    $stmt = $this->conn->prepare($query);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
      $result = $stmt->get_result();

      if ($result->num_rows > 0) return $result->fetch_assoc();
    }

    $this->logError("Execute failed (Obtener área por id): " . $stmt->error);
    return null;
  }

  public function obtenerAreaPorNombre($nombre)
  {
    $query = "SELECT * FROM {$this->table} WHERE area_nombre = ?";
    $stmt = $this->conn->prepare($query);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    $stmt->bind_param("s", $nombre);

    if ($stmt->execute()) {
      $result = $stmt->get_result();

      if ($result->num_rows > 0) return $result->fetch_assoc();
    }

    $this->logError("Execute failed (Obtener área por nombre): " . $stmt->error);
    return null;
  }

  public function editarArea($id, $nombre)
  {
    $query = "UPDATE {$this->table} SET area_nombre = ? WHERE area_id = ?";
    $stmt = $this->conn->prepare($query);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    $stmt->bind_param("si", $nombre, $id);

    if ($stmt->execute()) return true;

    $this->logError("Execute failed (Editar área): " . $stmt->error);
    return null;
  }

  public function desactivarArea($id)
  {
    $query = "UPDATE {$this->table} SET area_estado = 'desactivado' WHERE area_id = ?";
    $stmt = $this->conn->prepare($query);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    $stmt->bind_param("i", $id);

    if ($stmt->execute()) return true;

    $this->logError("Execute failed (Desactivar área): " . $stmt->error);
    return null;
  }

  private function logError($message)
  {
    error_log("[" . date("Y-m-d H:i:s") . "] $message" . PHP_EOL, 3, __DIR__ . "/../../../logs/php_errors.log");
  }
}
