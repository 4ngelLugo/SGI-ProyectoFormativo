<?php
class TipoDocumentoModel
{
  private $conn;
  private $tabla = "tipo_documento";
  private $error_return = "";

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function guardarTipoDocumento($nombre)
  {
    try {
      $query = "INSERT INTO {$this->tabla} (tipo_docu_nombre) VALUES (?)";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("s", $nombre);

      if (!$stmt->execute()) {
        $this->error_return = "error al guardar tipo documento";
        throw new Exception("Execute failed (Crear tipo de documento): " . $stmt->error);
      }

      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerTodosLosTipoDocumentos()
  {
    try {
      $query = "SELECT
              tipo_docu_id as id,
              tipo_docu_nombre as nombre,
              tipo_docu_estado as estado
              FROM {$this->tabla}";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener tipos documento";
        throw new Exception("Execute failed (Obtener todos los tipos de documento): " . $stmt->error);
      }

      $resultado = $stmt->get_result();
      return ["success" => true, "data" => $resultado->fetch_all(MYSQLI_ASSOC)];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerTipoDocumentoPorId($id)
  {
    try {
      $query = "SELECT
              tipo_docu_id as id,
              tipo_docu_nombre as nombre,
              tipo_docu_estado as estado
              FROM {$this->tabla}
              WHERE tipo_docu_id = ?";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("i", $id);

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener tipo documento";
        throw new Exception("Execute failed (Obtener tipo de documento por codigo): " . $stmt->error);
      }

      // Obtiene el resultado de la consulta y verifica si hay filas
      $resultado = $stmt->get_result();
      if ($resultado->num_rows > 0) return $resultado->fetch_assoc();
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerTipoDocumentoPorNombre($nombre)
  {
    try {
      $query = "SELECT * FROM {$this->tabla} WHERE tipo_docu_nombre = ?";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("s", $nombre);

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener tipo documento";
        throw new Exception("Execute failed (Obtener tipo de documento por nombre): " . $stmt->error);
      }

      // Obtiene el resultado de la consulta y verifica si hay filas
      $resultado = $stmt->get_result();
      if ($resultado->num_rows > 0) return $resultado->fetch_assoc();
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function editarTipoDocumento($id, $nombre)
  {
    try {
      $query = "UPDATE {$this->tabla} SET tipo_docu_nombre = ? WHERE tipo_docu_id = ?";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("si", $nombre, $id);

      if (!$stmt->execute()) {
        $this->error_return = "error al editar tipo documento";
        throw new Exception("Execute failed (Editar tipo de documento): " . $stmt->error);
      }

      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function desactivarTipoDocumento($id)
  {
    try {
      $query = "UPDATE {$this->tabla} SET tipo_docu_estado = 'desactivado' WHERE tipo_docu_id = ?";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("i", $id);

      if (!$stmt->execute()) {
        $this->error_return = "error al desactivar tiopo documento";
        throw new Exception("Execute failed (Deshabilitar tipo de documento): " . $stmt->error);
      }

      return ["success" => true];
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
