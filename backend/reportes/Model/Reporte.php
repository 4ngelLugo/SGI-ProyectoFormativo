<?php
// require_once '../../config/Database.php';
// require_once '../../elementos/Model/Elemento.php';

class Reporte
{
  private $tabla_elementos = "elementos";
  private $tabla_prestamos = "prestamos";
  private $tabla_prestamo_elementos = "prestamo_elementos";
  private $tabla_usuarios = "usuarios";
  // private $elemento_model;
  // private $prestamo_model;
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;

    // $database = new Database();

    // $this->conn = $database->getConnection();
    // $this->elemento_model = new Elemento($this->conn);
  }

  public function ObtenerCuentaElementosPrestados()
  {
    $sql = "SELECT
            p.elemento_codigo as codigo,
            e.elemento_nombre as nombre,
            COUNT(prestamo_id) as veces_prestados
            FROM {$this->tabla_prestamo_elementos} p
            JOIN {$this->tabla_elementos} e
            ON p.elemento_codigo = e.elemento_codigo
            GROUP BY p.elemento_codigo
            ORDER BY veces_prestados DESC";
    $stmt = $this->conn->prepare($sql);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    if ($stmt->execute()) {
      $result = $stmt->get_result();
      return ["success" => true, "data" => $result->fetch_all(MYSQLI_ASSOC)];
    }

    $this->logError("Execute failed (Obtener todos los elementos): " . $stmt->error);
    return null;
  }

  public function ObtenerCuentaPrestamosUsuario()
  {
    $sql = "SELECT
            p.usuario_documento as documento,
            u.usuario_nombre as nombre,
            u.usuario_apellido as apellido,
            COUNT(prestamo_id) as cantidad_prestamos
            FROM {$this->tabla_prestamos} p
            JOIN {$this->tabla_usuarios} u
            ON p.usuario_documento = u.usuario_documento
            GROUP BY p.usuario_documento
            ORDER BY cantidad_prestamos DESC";
    $stmt = $this->conn->prepare($sql);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    if ($stmt->execute()) {
      $result = $stmt->get_result();
      return ["success" => true, "data" => $result->fetch_all(MYSQLI_ASSOC)];
    }

    $this->logError("Execute failed (Obtener todos los elementos): " . $stmt->error);
    return null;
  }

  private function logError($message)
  {
    error_log("[" . date("Y-m-d H:i:s") . "] $message" . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
  }
}
