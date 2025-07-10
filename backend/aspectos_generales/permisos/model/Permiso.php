<?php
class Permiso
{
  private $conn;
  private $tabla = 'permisos';
  private $error_return = "";

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function obtenerTodosLosPermisos()
  {
    try {
      $sql = "SELECT
            permiso_id as id,
            permiso_nombre as nombre,
            permiso_modulo as modulo
            FROM {$this->tabla}
            ORDER BY permiso_modulo, permiso_nombre";
      $stmt = $this->conn->prepare($sql);


      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener permisos";
        throw new Exception("Execute failed (Obtener todos los permisos): " . $stmt->error);
      }

      $resultado = $stmt->get_result();
      return ["success" => true, "data" => $resultado->fetch_all(MYSQLI_ASSOC)];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obterPermisosPorRol(int $rol_id)
  {
    try {
      $sql = "SELECT
        p.permiso_id as id,
        p.permiso_nombre as permiso,
        p.permiso_modulo as modulo
        FROM permisos p
        INNER JOIN roles_permisos rp
        ON p.permiso_id = rp.permiso_id
        WHERE rp.rol_id = ?";
      $stmt = $this->conn->prepare($sql);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("i", $rol_id);

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener permisos";
        throw new Exception("Execute failed (Obtener todos los permisos del usuario): " . $stmt->error);
      }

      $resultado = $stmt->get_result();
      return ["success" => true, "data" => $resultado->fetch_all(MYSQLI_ASSOC)];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  private function logError($message)
  {
    error_log("[" . date("Y-m-d H:i:s") . "] $message" . PHP_EOL, 3, __DIR__ . "/../../../logs/php_errors.log");
  }
}
