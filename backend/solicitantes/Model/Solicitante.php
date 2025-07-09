<?php
class Solicitante
{
  private $conn;
  private $tabla = "solicitantes";
  private $error_return = "";

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function crearSolicitante($data)
  {
    try {
      $query = "INSERT INTO {$this->tabla} (
        solicitante_documento, 
        solicitante_nombre, 
        solicitante_correo, 
        solicitante_telefono, 
        solicitante_direccion
        ) VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        solicitante_nombre = VALUES(solicitante_nombre),
        solicitante_correo = VALUES(solicitante_correo),
        solicitante_telefono = VALUES(solicitante_telefono),
        solicitante_direccion = VALUES(solicitante_direccion)";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param(
        "issis",
        $data['identificacion'],
        $data['nombre_apellido'],
        $data['correo'],
        $data['telefono'],
        $data['direccion']
      );

      if (!$stmt->execute()) {
        $this->error_return = "error al guardar";
        throw new Exception("Execute failed (Crear elemento): " . $stmt->error);
      }

      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerTodosLosSolicitantes()
  {
    try {
      $sql = "SELECT
        solicitante_documento as documento,
        solicitante_nombre as nombre,
        solicitante_correo as correo,
        solicitante_telefono as telefono,
        solicitante_direccion as direccion
        FROM {$this->tabla}";
      $stmt = $this->conn->prepare($sql);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener";
        throw new Exception("Execute failed (Obtener todos los solicitantes): " . $stmt->error);
      }

      // Obtiene el resultado de la consulta y verifica si hay filas
      $resultado = $stmt->get_result();
      return ["success" => true, "data" => $resultado->fetch_all(MYSQLI_ASSOC)];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerSolicitantePorDocumento(int $documento)
  {
    try {
      $sql = "SELECT
        solicitante_documento as documento,
        solicitante_nombre as nombre,
        solicitante_correo as correo,
        solicitante_telefono as telefono,
        solicitante_direccion as direccion
        FROM {$this->tabla}
        WHERE solicitante_documento = ?";
      $stmt = $this->conn->prepare($sql);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("i", $documento);

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener";
        throw new Exception("Execute failed (Obtener solicitante por documento): " . $stmt->error);
      }

      // Obtiene el resultado de la consulta y verifica si hay filas
      $resultado = $stmt->get_result();
      if ($resultado->num_rows > 0) return $resultado->fetch_assoc();
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  private function logError($message)
  {
    error_log("[" . date("Y-m-d H:i:s") . "] $message" . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
  }
}
