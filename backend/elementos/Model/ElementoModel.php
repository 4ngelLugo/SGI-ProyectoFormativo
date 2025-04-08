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
    $query = "INSERT INTO " . $this->table_devo . " (ele_dev_codigo, ele_dev_nombre, ele_dev_placa, ele_dev_serial, area_id, marca_id, ele_dev_modelo) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("issiiis", $codigo, $nombre, $placa, $serial, $area, $marca, $modelo);

    if ($stmt->execute()) return true;

    // Registrar error en archivo
    error_log("[" . date("Y-m-d H:i:s") . "] Execute failed (Save 'elemento devolutivo'): " . $stmt->error . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
    return null;
  }

  public function saveElementoConsumible($codigo, $nombre, $area, $cantidad)
  {
    $query = "INSERT INTO " . $this->table_cons . " (ele_con_codigo, ele_con_nombre, ele_con_cantidad, area_id) VALUES (?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("isii", $codigo, $nombre, $cantidad, $area);

    if ($stmt->execute()) return true;

    // Registrar error en archivo
    error_log("[" . date("Y-m-d H:i:s") . "] Execute failed (Save 'elemento consumible'): " . $stmt->error . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
    return null;
  }

  public function getElementoByCodigo($codigo, $tabla_tipo)
  {
    $column = $tabla_tipo == "elementos_consumibles" ? "ele_con_codigo" : "ele_dev_codigo";

    $query = "SELECT * FROM $tabla_tipo WHERE $column = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param('i', $codigo);

    if ($stmt->execute()) {
      $result = $stmt->get_result();
      if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row;
      }
    }

    return null;
  }
}
