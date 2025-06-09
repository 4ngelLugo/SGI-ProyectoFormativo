<?php

class ElementoModel
{
  private $conn;
  public $table = "elementos";

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function saveElemento($codigo, $nombre, $tipo, $categoria_id, $area_id, $placa, $serial, $marca_id, $modelo, $cantidad, $und_medida, $estado_elemento_id)
  {
    $query = "INSERT INTO {$this->table}
              (elemento_codigo, elemento_nombre, elemento_tipo, categoria_id, area_id, elemento_placa, elemento_serial, marca_id, elemento_modelo, elemento_cantidad, elemento_und_medida, estado_elemento_id)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param(
      "sssiiisssisi",
      $codigo,
      $nombre,
      $tipo,
      $categoria_id,
      $area_id,
      $placa,
      $serial,
      $marca_id,
      $modelo,
      $cantidad,
      $und_medida,
      $estado_elemento_id
    );

    if ($stmt->execute()) return true;

    // Registrar error en archivo
    error_log("[" . date("Y-m-d H:i:s") . "] Execute failed (Save 'elemento'): " . $stmt->error . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
    return null;
  }

  public function getAllElementos($estado_elemento_id = 1)
  {
    $query = "SELECT * FROM {$this->table} WHERE estado_elemento_id = ? ORDER BY elemento_tipo DESC, elemento_codigo ASC";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $estado_elemento_id);

    if ($stmt->execute()) {
      $result = $stmt->get_result();
      return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Registrar error en archivo
    error_log("[" . date("Y-m-d H:i:s") . "] Execute failed (Fetch elements): " . $stmt->error . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
    return null;
  }

  public function getElementoByCodigo($codigo)
  {
    $query = "SELECT * FROM {$this->table} WHERE elemento_codigo = ?";
    $stmt = $this->conn->prepare($query);
    if (!$stmt) {
      error_log("Error preparando query de elemento: " . $this->conn->error . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
      return null;
    }

    $stmt->bind_param('s', $codigo);

    if ($stmt->execute()) {
      $result = $stmt->get_result();
      if ($result->num_rows > 0) {
        return $result->fetch_assoc();
      }
    } else {
      error_log("[" . date("Y-m-d H:i:s") . "] Execute failed (Fetch element): " . $stmt->error . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
      return null;
    }

    return null;
  }

  public function deactivateElemento($codigo)
  {
    $query = "UPDATE {$this->table} SET estado_elemento_id = 0 WHERE elemento_codigo = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param('s', $codigo);

    if ($stmt->execute()) return true;

    // Registrar error en archivo
    error_log("[" . date("Y-m-d H:i:s") . "] Execute failed (Deactivate element): " . $stmt->error . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
    return null;
  }
}
