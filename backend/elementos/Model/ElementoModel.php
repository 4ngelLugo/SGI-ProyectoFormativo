<?php

class ElementoModel
{
  private $conn;
  public $table_cons = "elementos_consumibles";
  public $table_devo = "elementos_devolutivos";

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function saveElementoDevolutivo($codigo, $nombre, $area, $placa, $serial, $marca, $modelo)
  {
    $query = "INSERT INTO {$this->table_devo}
              (ele_dev_codigo, ele_dev_nombre, ele_dev_placa, ele_dev_serial, area_id, marca_id, ele_dev_modelo)
              VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("issiiis", $codigo, $nombre, $placa, $serial, $area, $marca, $modelo);

    if ($stmt->execute()) return true;

    // Registrar error en archivo
    error_log("[" . date("Y-m-d H:i:s") . "] Execute failed (Save 'elemento devolutivo'): " . $stmt->error . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
    return null;
  }

  public function saveElementoConsumible($codigo, $nombre, $area, $cantidad, $medida)
  {
    $query = "INSERT INTO {$this->table_cons}
              (ele_con_codigo, ele_con_nombre, ele_con_cantidad, ele_con_medida, area_id)
              VALUES (?, ?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("isiii", $codigo, $nombre, $cantidad, $area, $medida);

    if ($stmt->execute()) return true;

    // Registrar error en archivo
    error_log("[" . date("Y-m-d H:i:s") . "] Execute failed (Save 'elemento consumible'): " . $stmt->error . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
    return null;
  }

  public function getAllElementos($estado = "activo")
  {
    $query = "SELECT * FROM (
                SELECT ele_dev_codigo AS codigo, ele_dev_nombre AS nombre, area_nombre AS area, 'devolutivo' AS tipo, ele_dev_estado AS estado
                FROM {$this->table_devo} d
                JOIN areas a ON d.area_id = a.area_id
                WHERE ele_dev_estado = ?
                UNION
                SELECT ele_con_codigo AS codigo, ele_con_nombre AS nombre, area_nombre AS area, 'consumible' AS tipo, ele_con_estado AS estado
                FROM {$this->table_cons} c
                JOIN areas a ON c.area_id = a.area_id
                WHERE ele_con_estado = ?
              ) AS elementos
              ORDER BY tipo DESC, codigo ASC";

    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("ss", $estado, $estado);

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
    $query_devo = "SELECT 
                  ele_dev_codigo AS codigo, 
                  ele_dev_nombre AS nombre, 
                  ele_dev_placa AS placa, 
                  ele_dev_serial AS serial, 
                  d.area_id AS area_id, 
                  a.area_nombre AS area, 
                  d.marca_id AS marca_id,
                  m.marca_nombre as marca, 
                  ele_dev_modelo AS modelo, 
                  'devolutivo' AS tipo, 
                  ele_dev_estado AS estado
                  FROM {$this->table_devo} d
                  JOIN areas a ON d.area_id = a.area_id
                  JOIN marcas m ON d.marca_id = m.marca_id
                  WHERE ele_dev_codigo = ?";
    $stmt = $this->conn->prepare($query_devo);
    if (!$stmt) {
      error_log("Error preparando query de devolutivo: " . $stmt->error . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
      return null;
    }

    $stmt->bind_param('i', $codigo);

    if ($stmt->execute()) {
      $result_devo = $stmt->get_result();

      if ($result_devo->num_rows > 0) {
        return $result_devo->fetch_assoc();
      }
    } else {
      error_log("[" . date("Y-m-d H:i:s") . "] Execute failed (Fetch element devolutivo): " . $stmt->error . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
      return null;
    }

    $query_cons = "SELECT 
                  ele_con_codigo AS codigo, 
                  ele_con_nombre AS nombre, 
                  ele_con_cantidad AS cantidad, 
                  c.area_id AS area_id, 
                  a.area_nombre AS area, 
                  ele_con_medida AS medida, 
                  'consumible' AS tipo, 
                  ele_con_estado AS estado
                  FROM {$this->table_cons} c
                  JOIN areas a ON c.area_id = a.area_id
                  WHERE ele_con_codigo = ?";
    $stmt = $this->conn->prepare($query_cons);
    if (!$stmt) {
      error_log("Error preparando query de consumible: " . $this->conn->error . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
      return null;
    }

    $stmt->bind_param('i', $codigo);

    if ($stmt->execute()) {
      $result_cons = $stmt->get_result();

      if ($result_cons->num_rows > 0) {
        return $result_cons->fetch_assoc();
      }
    } else {
      error_log("[" . date("Y-m-d H:i:s") . "] Execute failed (Fetch element consumible): " . $stmt->error . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
      return null;
    }

    return null;
  }

  public function updateElemento($codigo, $nombre, $area, $tipo, $placa = null, $serial = null, $marca = null, $modelo = null, $cantidad = null, $medida = null)
  {

    if ($tipo === "devolutivo") {
      $query = "UPDATE {$this->table_devo} SET ele_dev_nombre = ?, ele_dev_placa = ?, ele_dev_serial = ?, area_id = ?, marca_id = ?, ele_dev_modelo = ? WHERE ele_dev_codigo = ?";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        error_log("Error preparando query de devolutivo: " . $this->conn->error . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
        return null;
      }

      $stmt->bind_param("sssiisi", $nombre, $placa, $serial, $area, $marca, $modelo, $codigo);
      
    } else if ($tipo === "consumible") {
      $query = "UPDATE {$this->table_cons} SET ele_con_nombre = ?, ele_con_cantidad = ?, ele_con_medida = ?, area_id = ? WHERE ele_con_codigo = ?";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        error_log("Error preparando query de consumible: " . $this->conn->error . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
        return null;
      }

      $stmt->bind_param("sisii", $nombre, $cantidad, $medida, $area, $codigo);
    }

    if ($stmt->execute()) return true;
    
    // Registrar error en archivo
    error_log("[" . date("Y-m-d H:i:s") . "] Execute failed (Update element): " . $stmt->error . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
    return null;
  }

  public function deactivateElemento($codigo, $tabla_tipo)
  {
    $column = ($tabla_tipo == "{$this->table_cons}") ? "ele_con_codigo" : "ele_dev_codigo";
    $estado_col = $tabla_tipo === $this->table_cons ? "ele_con_estado" : "ele_dev_estado";

    $query = "UPDATE {$tabla_tipo} SET {$estado_col} = 'desactivado' WHERE {$column} = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param('i', $codigo);

    if ($stmt->execute()) return true;

    // Registrar error en archivo
    error_log("[" . date("Y-m-d H:i:s") . "] Execute failed (Deactivate element): " . $stmt->error . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
    return null;
  }
}
