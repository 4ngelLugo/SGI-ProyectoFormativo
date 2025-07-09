<?php
class CategoriaModel
{
  private $conn;
  private $tabla = "categorias";
  private $error_return = "";

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function guardarCategoria($nombre, $tipo)
  {
    try {
      $query = "INSERT INTO {$this->tabla} (
        categoria_nombre,
        categoria_tipo
        ) VALUES (?, ?)";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param(
        "ss",
        $nombre,
        $tipo
      );
      
      if (!$stmt->execute()) {
        $this->error_return = "error al guardar";
        throw new Exception("Execute failed (Crear categoria): " . $stmt->error);
      }

      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerTodasLasCategorias()
  {
    try {
      $query = "SELECT 
              categoria_id as id,
              categoria_nombre as nombre,
              categoria_tipo as tipo,
              categoria_estado as estado
              FROM {$this->tabla}";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener";
        throw new Exception("Execute failed (Obtener todas las categorias): " . $stmt->error);
      }

      $resultado = $stmt->get_result();
      return ["success" => true, "data" => $resultado->fetch_all(MYSQLI_ASSOC)];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerCategoriaPorId($id)
  {
    try {
      $query = "SELECT 
        categoria_id as id,
        categoria_nombre as nombre,
        categoria_estado as estado,
        categoria_tipo as tipo
        FROM {$this->tabla} 
        WHERE categoria_id = ?";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("i", $id);

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener";
        throw new Exception("Execute failed (Obtener categoria por codigo): " . $stmt->error);
      }

      // Obtiene el resultado de la consulta y verifica si hay filas
      $resultado = $stmt->get_result();
      if ($resultado->num_rows > 0) return $resultado->fetch_assoc();
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerCategoriaPorNombre($nombre)
  {
    try {
      $query = "SELECT 
              categoria_id as id,
              categoria_nombre as nombre,
              categoria_estado as estado,
              categoria_tipo as tipo
              FROM {$this->tabla} 
              WHERE categoria_nombre = ?";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("s", $nombre);

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener";
        throw new Exception("Execute failed (Obtener categoria por nombre): " . $stmt->error);
      }

      // Obtiene el resultado de la consulta y verifica si hay filas
      $resultado = $stmt->get_result();
      if ($resultado->num_rows > 0) return $resultado->fetch_assoc();
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function editarCategoria($id, $nombre)
  {
    try {
      $query = "UPDATE {$this->tabla} SET categoria_nombre = ? WHERE categoria_id = ?";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("si", $nombre, $id);

      if (!$stmt->execute()) {
        $this->error_return = "error al crear";
        throw new Exception("Execute failed (Editar categoria): " . $stmt->error);
      }

      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function desactivarCategoria($id)
  {
    try {
      $query = "UPDATE {$this->tabla} SET categoria_estado = 'desactivado' WHERE categoria_id = ?";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("i", $id);

      if (!$stmt->execute()) {
        $this->error_return = "error al crear";
        throw new Exception("Execute failed (Deshabilitar categoria): " . $stmt->error);
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
