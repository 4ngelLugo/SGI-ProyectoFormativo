<?php
class AreaModel
{
  private $conn;
  private $tabla = "areas";
  private $error_return = "";

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function guardarArea($nombre)
  {
    try {
      $query = "INSERT INTO {$this->tabla} (area_nombre) VALUES (?)";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("s", $nombre);

      if (!$stmt->execute()) {
        $this->error_return = "error al guardar area";
        throw new Exception("Execute failed (Crear area): " . $stmt->error);
      }

      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerTodasLasAreas()
  {
    try {
      $query = "SELECT 
              area_id as id,
              area_nombre as nombre,
              area_estado as estado
              FROM {$this->tabla}";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener areas";
        throw new Exception("Execute failed (Obtener todas las areas): " . $stmt->error);
      }

      $resultado = $stmt->get_result();
      return ["success" => true, "data" => $resultado->fetch_all(MYSQLI_ASSOC)];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerAreaPorId($id)
  {
    try {
      $query = "SELECT 
              area_id as id,
              area_nombre as nombre,
              area_estado as estado
              FROM {$this->tabla} 
              WHERE area_id = ?";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("i", $id);

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener area";
        throw new Exception("Execute failed (Obtener area por codigo): " . $stmt->error);
      }

      // Obtiene el resultado de la consulta y verifica si hay filas
      $resultado = $stmt->get_result();
      if ($resultado->num_rows > 0) return $resultado->fetch_assoc();
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerAreaPorNombre($nombre)
  {
    try {
      $query = "SELECT * FROM {$this->tabla} WHERE area_nombre = ?";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("s", $nombre);

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener area";
        throw new Exception("Execute failed (Obtener area por nombre): " . $stmt->error);
      }

      // Obtiene el resultado de la consulta y verifica si hay filas
      $resultado = $stmt->get_result();
      if ($resultado->num_rows > 0) return $resultado->fetch_assoc();
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function editarArea($id, $nombre)
  {
    try {
      $query = "UPDATE {$this->tabla} SET area_nombre = ? WHERE area_id = ?";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("si", $nombre, $id);

      if (!$stmt->execute()) {
        $this->error_return = "error al editar area";
        throw new Exception("Execute failed (Editar area): " . $stmt->error);
      }

      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function desactivarArea($id)
  {
    try {
      $query = "UPDATE {$this->tabla} SET area_estado = 'desactivado' WHERE area_id = ?";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("i", $id);

      if (!$stmt->execute()) {
        $this->error_return = "error al desactivar area";
        throw new Exception("Execute failed (Deshabilitar area): " . $stmt->error);
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
