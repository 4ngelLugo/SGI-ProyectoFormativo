<?php
class MarcaModel
{
  private $conn;
  public $tabla = "marcas";

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function guardarMarca($nombre)
  {
    $query = "INSERT INTO {$this->tabla} (marca_nombre) VALUES (?)";
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

  public function obtenerTodasLasMarcas()
  {
    $query = "SELECT
              marca_id as id,
              marca_nombre as nombre,
              marca_estado as estado
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

  public function obtenerMarcaPorId($id)
  {
    $query = "SELECT
              marca_id as id,
              marca_nombre as nombre,
              marca_estado as estado
              FROM {$this->tabla}
              WHERE marca_id = ?";
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

  public function obtenerMarcaPorNombre($nombre)
  {
    $query = "SELECT * FROM {$this->tabla} WHERE marca_nombre = ?";
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

  public function editarMarca($id, $nombre)
  {
    $query = "UPDATE {$this->tabla} SET marca_nombre = ? WHERE marca_id = ?";
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

  public function desactivarMarca($id)
  {
    $query = "UPDATE {$this->tabla} SET marca_estado = 'desactivado' WHERE marca_id = ?";
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
