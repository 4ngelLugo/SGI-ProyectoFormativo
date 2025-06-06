<?php
class CategoriaModel
{
  private $conn;
  public $tabla = "categorias";

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function guardarCategoria($nombre)
  {
    $query = "INSERT INTO {$this->tabla} (categoria_nombre) VALUES (?)";
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

  public function obtenerTodasLasCategorias()
  {
    $query = "SELECT
              categoria_id as id,
              categoria_nombre as nombre,
              categoria_estado as estado
              FROM {$this->tabla}";
    $stmt = $this->conn->prepare($query);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    if ($stmt->execute()) {
      $result = $stmt->get_result();
      return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Registrar error en archivo
    $this->logError("Execute failed (Obtener todas las áreas): " . $stmt->error);
    return null;
  }

  public function obtenerCategoriaPorId($id)
  {
    $query = "SELECT
              categoria_id as id,
              categoria_nombre as nombre,
              categoria_estado as estado
              FROM {$this->tabla}
              WHERE categoria_id = ?";
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

  public function obtenerCategoriaPorNombre($nombre)
  {
    $query = "SELECT * FROM {$this->tabla} WHERE categoria_nombre = ?";
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

  public function editarCategoria($id, $nombre)
  {
    $query = "UPDATE {$this->tabla} SET categoria_nombre = ? WHERE categoria_id = ?";
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

  public function desactivarCategoria($id)
  {
    $query = "UPDATE {$this->tabla} SET categoria_estado = 'desactivado' WHERE categoria_id = ?";
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
