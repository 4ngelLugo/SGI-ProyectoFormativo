<?php
class Elemento
{
  private $conn;
  private $tabla = "elementos";
  private $error_return = "";

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function guardarElemento(array $datos)
  {
    try {
      $query = "INSERT INTO {$this->tabla} ( 
        elemento_codigo,
        elemento_nombre,
        elemento_tipo,
        categoria_id,
        area_id,
        elemento_placa,
        elemento_serial,
        marca_id,
        elemento_modelo,
        elemento_cantidad,
        elemento_und_medida,
        elemento_recomendacion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param(
        "sssiiisisiss",
        $datos['codigo'],
        $datos['nombre'],
        $datos['tipo'],
        $datos['categoria'],
        $datos['area'],
        $datos['placa'],
        $datos['serial'],
        $datos['marca'],
        $datos['modelo'],
        $datos['cantidad'],
        $datos['medida'],
        $datos['recomendacion']
      );

      if (!$stmt->execute()) {
        $this->error_return = "error al guardar elemento";
        throw new Exception("Execute failed (Crear elemento): " . $stmt->error);
      }

      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerTodosLosElementos()
  {
    try {
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
        t.estado_elemento_nombre as estado,
        e.elemento_recomendacion as recomendacion
        FROM {$this->tabla} e
        INNER JOIN categorias c ON e.categoria_id = c.categoria_id
        INNER JOIN areas a ON e.area_id = a.area_id
        LEFT JOIN marcas m ON e.marca_id = m.marca_id
        INNER JOIN estados_elementos t ON e.estado_elemento_id = t.estado_elemento_id
        ORDER BY elemento_tipo ASC, elemento_codigo ASC";
      $stmt = $this->conn->prepare($sql);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener elementos";
        throw new Exception("Execute failed (Obtener todos los elementos): " . $stmt->error);
      }

      // Obtiene el resultado de la consulta y verifica si hay filas
      $resultado = $stmt->get_result();
      return ["success" => true, "data" => $resultado->fetch_all(MYSQLI_ASSOC)];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerElementoPorCodigo(string $codigo)
  {
    try {
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
            t.estado_elemento_nombre as estado,
            e.elemento_recomendacion as recomendacion
            FROM {$this->tabla} e
            INNER JOIN categorias c ON e.categoria_id = c.categoria_id
            INNER JOIN areas a ON e.area_id = a.area_id
            LEFT JOIN marcas m ON e.marca_id = m.marca_id
            INNER JOIN estados_elementos t ON e.estado_elemento_id = t.estado_elemento_id
            WHERE e.elemento_codigo = ?";
      $stmt = $this->conn->prepare($sql);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param('s', $codigo);

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener elemento";
        throw new Exception("Execute failed (Obtener elemento por codigo): " . $stmt->error);
      }

      // Obtiene el resultado de la consulta y verifica si hay filas
      $resultado = $stmt->get_result();
      if ($resultado->num_rows > 0) return $resultado->fetch_assoc();
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function editarElemento(array $datos)
  {
    try {
      $sql = "UPDATE {$this->tabla} SET
      elemento_nombre = ?,
      elemento_tipo = ?,
      categoria_id = ?,
      area_id = ?,
      elemento_placa = ?,
      elemento_serial = ?,
      marca_id = ?,
      elemento_modelo = ?,
      elemento_cantidad = ?,
      elemento_und_medida = ?,
      elemento_recomendacion = ?
      WHERE elemento_codigo = ?";
      $stmt = $this->conn->prepare($sql);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param(
        "ssiiisisisss",
        $datos['nombre'],
        $datos['tipo'],
        $datos['categoria'],
        $datos['area'],
        $datos['placa'],
        $datos['serial'],
        $datos['marca'],
        $datos['modelo'],
        $datos['cantidad'],
        $datos['medida'],
        $datos['recomendacion'],
        $datos['codigo']
      );

      if (!$stmt->execute()) {
        $this->error_return = "error al editar elemento";
        throw new Exception("Execute failed (Editar elemento): " . $stmt->error);
      }

      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function cambiarCantidadConsumible(string $codigo, string $operacion, int $cantidad)
  {
    try {
      switch ($operacion) {
        case "sumar":
          $sql = "UPDATE {$this->tabla} SET
            elemento_cantidad = elemento_cantidad + ?
            WHERE elemento_codigo = ?";
          break;

        case "restar":
          $sql = "UPDATE {$this->tabla} SET
            elemento_cantidad = elemento_cantidad - ?
            WHERE elemento_codigo = ?";
          break;

        default:
          return ["error" => "operacion no valida"];
      }
      $stmt = $this->conn->prepare($sql);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param('is', $cantidad, $codigo);

      if (!$stmt->execute()) {
        $this->error_return = "error al editar elemento";
        throw new Exception("Execute failed (Cambiar cantidad de elemento): " . $stmt->error);
      }

      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function cambiarEstadoElemento(string $codigo, int $estado)
  {
    try {
      $sql = "UPDATE {$this->tabla} SET
        estado_elemento_id = ?
        WHERE elemento_codigo = ?";
      $stmt = $this->conn->prepare($sql);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param('is', $estado, $codigo);

      if (!$stmt->execute()) {
        $this->error_return = "error al editar elemento";
        throw new Exception("Execute failed (Cambiar estado de elemento): " . $stmt->error);
      }

      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function deshabilitarElemento(string $codigo)
  {
    try {
      $sql = "UPDATE {$this->tabla} SET
      estado_elemento_id = 4 
      WHERE elemento_codigo = ?"; // 4: Inhabilitado
      $stmt = $this->conn->prepare($sql);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param('s', $codigo);

      if (!$stmt->execute()) {
        $this->error_return = "error al desactivar elemento";
        throw new Exception("Execute failed (Deshabilitar elemento): " . $stmt->error);
      }

      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  private function logError($message)
  {
    error_log("[" . date("Y-m-d H:i:s") . "] $message" . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
  }
}
