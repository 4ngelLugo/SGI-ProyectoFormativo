<?php
class Elemento
{
  private $conn;
  public $tabla = "elementos";

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function guardarElemento($codigo, $nombre, $tipo, $categoria, $area, $placa = null, $serial = null, $marca = null, $modelo = null, $cantidad = null, $medida = null)
  {
    $query = "INSERT INTO {$this->tabla}
              (elemento_codigo, elemento_nombre, elemento_tipo, categoria_id, area_id, elemento_placa, elemento_serial, marca_id, elemento_modelo, elemento_cantidad, elemento_und_medida)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    $stmt->bind_param("issiissisis", $codigo, $nombre, $tipo, $categoria, $area, $placa, $serial, $marca, $modelo, $cantidad, $medida);

    if ($stmt->execute()) return true;

    // Registrar error en archivo
    $this->logError("Execute failed (Guardar elemento): " . $stmt->error);
    return null;
  }

  public function obtenerTodosLosElementos()
  {
    $sql = "SELECT 
            e.elemento_codigo as codigo,
            e.elemento_nombre as nombre,
            e.elemento_tipo as tipo,
            c.categoria_nombre as categoria,
            a.area_nombre as area,
            e.elemento_placa as placa,
            e.elemento_serial as serial,
            m.marca_nombre as marca,
            e.elemento_modelo as modelo,
            e.elemento_cantidad as cantidad,
            e.elemento_und_medida as 'unidadMedida',
            t.estado_elemento_nombre as estado
            FROM elementos e
            INNER JOIN categorias c ON e.categoria_id = c.categoria_id
            INNER JOIN areas a ON e.area_id = a.area_id
            LEFT JOIN marcas m ON e.marca_id = m.marca_id
            INNER JOIN estados_elementos t ON e.estado_elemento_id = t.estado_elemento_id
            WHERE e.estado_elemento_id <> 4
            ORDER BY elemento_tipo ASC, elemento_codigo ASC";
    $stmt = $this->conn->prepare($sql);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    if ($stmt->execute()) {
      $result = $stmt->get_result();
      return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Registrar error en archivo
    $this->logError("Execute failed (Obtener todos los elementos): " . $stmt->error);
    return null;
  }

  public function obtenerElementoPorCodigo($codigo)
  {
    $sql = "SELECT 
            e.elemento_codigo as codigo,
            e.elemento_nombre as nombre,
            e.elemento_tipo as tipo,
            c.categoria_id as categoria,
            c.categoria_nombre as categoriaNombre,
            a.area_id as area,
            a.area_nombre as areaNombre,
            e.elemento_placa as placa,
            e.elemento_serial as serial,
            m.marca_id as marca,
            m.marca_nombre as marcaNombre,
            e.elemento_modelo as modelo,
            e.elemento_cantidad as cantidad,
            e.elemento_und_medida as 'unidadMedida',
            t.estado_elemento_nombre as estado
            FROM elementos e
            INNER JOIN categorias c ON e.categoria_id = c.categoria_id
            INNER JOIN areas a ON e.area_id = a.area_id
            LEFT JOIN marcas m ON e.marca_id = m.marca_id
            INNER JOIN estados_elementos t ON e.estado_elemento_id = t.estado_elemento_id
            WHERE e.elemento_codigo = ?";
    $stmt = $this->conn->prepare($sql);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    $stmt->bind_param('i', $codigo);

    if ($stmt->execute()) {
      $result = $stmt->get_result();

      if ($result->num_rows > 0) return $result->fetch_assoc();
    }

    $this->logError("Execute failed (Obtener elemento por id): " . $stmt->error);
    return null;
  }

  public function editarElemento($codigo, $nombre, $tipo, $categoria, $area, $placa = null, $serial = null, $marca = null, $modelo = null, $cantidad = null, $medida = null)
  {
    $sql = "UPDATE {$this->tabla}
            SET elemento_nombre = ?, elemento_tipo = ?, categoria_id = ?, area_id = ?, elemento_placa = ?, elemento_serial = ?, marca_id = ?, elemento_modelo = ?, elemento_cantidad = ?, elemento_und_medida = ?
            WHERE elemento_codigo = ?";
    $stmt = $this->conn->prepare($sql);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    $stmt->bind_param("ssiissisisi", $nombre, $tipo, $categoria, $area, $placa, $serial, $marca, $modelo, $cantidad, $medida, $codigo);

    if ($stmt->execute()) return true;

    // Registrar error en archivo
    $this->logError("Execute failed (Editar elemento): " . $stmt->error);
    return null;
  }

  public function deshabilitarElemento($codigo)
  {
    $query = "UPDATE {$this->tabla} SET estado_elemento_id = 4 WHERE elemento_codigo = ?";
    $stmt = $this->conn->prepare($query);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    $stmt->bind_param('i', $codigo);

    if ($stmt->execute()) return true;

    // Registrar error en archivo
    $this->logError("Execute failed (Deshabilitar elemento): " . $stmt->error);
    return null;
  }

  private function logError($message)
  {
    error_log("[" . date("Y-m-d H:i:s") . "] $message" . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
  }
}
