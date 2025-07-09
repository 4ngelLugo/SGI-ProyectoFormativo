<?php
class MarcaModel
{
  private $conn;
  private $tabla = "marcas";
  private $error_return = "";

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function guardarMarca($nombre)
  {
    try {
      $query = "INSERT INTO {$this->tabla} (marca_nombre) VALUES (?)";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("s", $nombre);

      if (!$stmt->execute()) {
        $this->error_return = "error al guardar marca";
        throw new Exception("Execute failed (Crear marca): " . $stmt->error);
      }

      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerTodasLasMarcas()
  {
    try {
      $query = "SELECT
              marca_id as id,
              marca_nombre as nombre,
              marca_estado as estado
              FROM {$this->tabla}";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener marcas";
        throw new Exception("Execute failed (Obtener todas las marcas): " . $stmt->error);
      }

      $resultado = $stmt->get_result();
      return ["success" => true, "data" => $resultado->fetch_all(MYSQLI_ASSOC)];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerMarcaPorId($id)
  {
    try {
      $query = "SELECT
              marca_id as id,
              marca_nombre as nombre,
              marca_estado as estado
              FROM {$this->tabla}
              WHERE marca_id = ?";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("i", $id);

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener marca";
        throw new Exception("Execute failed (Obtener marca por codigo): " . $stmt->error);
      }

      // Obtiene el resultado de la consulta y verifica si hay filas
      $resultado = $stmt->get_result();
      if ($resultado->num_rows > 0) return $resultado->fetch_assoc();
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerMarcaPorNombre($nombre)
  {
    try {
      $query = "SELECT * FROM {$this->tabla} WHERE marca_nombre = ?";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener marca";
        throw new Exception("Execute failed (Obtener marca por nombre): " . $stmt->error);
      }

      // Obtiene el resultado de la consulta y verifica si hay filas
      $resultado = $stmt->get_result();
      if ($resultado->num_rows > 0) return $resultado->fetch_assoc();
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function editarMarca($id, $nombre)
  {
    try {
      $query = "UPDATE {$this->tabla} SET marca_nombre = ? WHERE marca_id = ?";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("si", $nombre, $id);

      if (!$stmt->execute()) {
        $this->error_return = "error al editar marca";
        throw new Exception("Execute failed (Editar marca): " . $stmt->error);
      }

      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function desactivarMarca($id)
  {
    try {
      $query = "UPDATE {$this->tabla} SET marca_estado = 'desactivado' WHERE marca_id = ?";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("i", $id);

      if (!$stmt->execute()) {
        $this->error_return = "error al desactivar marca";
        throw new Exception("Execute failed (Deshabilitar marca): " . $stmt->error);
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
