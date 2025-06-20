<?php
class Permiso
{
  private $conn;
  private $tabla = 'permisos';

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function obtenerTodosLosPermisos()
  {
    $sql = "SELECT
            permiso_id as id,
            permiso_nombre as nombre,
            permiso_modulo as modulo
            FROM {$this->tabla}
            ORDER BY permiso_modulo, permiso_nombre";
    $stmt = $this->conn->prepare($sql);


    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    if ($stmt->execute()) {
      $result = $stmt->get_result();
      return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Registrar error en archivo
    $this->logError("Execute failed (Obtener todas los permisos): " . $stmt->error);
    return null;
  }

  private function logError($message)
  {
    error_log("[" . date("Y-m-d H:i:s") . "] $message" . PHP_EOL, 3, __DIR__ . "/../../../logs/php_errors.log");
  }
}
