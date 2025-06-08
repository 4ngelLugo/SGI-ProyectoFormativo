<?php
class UsuarioModel
{
  private $conn;
  private $tabla = "usuarios";

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function guardarUsuario($documento, $tipo_documento, $nombres, $apellidos, $telefono, $direccion, $correo, $contrasena, $rol)
  {
    $query = "INSERT INTO {$this->tabla}
              (usuario_documento, tipo_docu_id,
              usuario_nombre, usuario_apellido,
              usuario_telefono, usuario_direccion,
              usuario_correo, usuario_contrasena, rol_id)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    $stmt->bind_param("iississsi", $documento, $tipo_documento, $nombres, $apellidos, $telefono, $direccion, $correo, $contrasena, $rol);

    if ($stmt->execute()) return true;

    $this->logError("Execute failed (Guardar usuario): " . $stmt->error);
    return null;
  }

  public function obtenerTodosLosUsuarios($estado = "activo")
  {
    $sql = "SELECT
            u.usuario_documento as documento,
            t.tipo_docu_nombre as tipoDocumento,
            u.usuario_nombre as nombres,
            u.usuario_apellido as apellidos,
            u.usuario_telefono as telefono,
            u.usuario_direccion as direccion,
            u.usuario_correo as correo,
            u.usuario_contrasena as contrasena,
            r.rol_nombre as rol,
            u.usuario_estado as estado
            FROM usuarios u
            INNER JOIN tipo_documento t
            ON u.tipo_docu_id = t.tipo_docu_id
            INNER JOIN roles r
            ON u.rol_id = r.rol_id
            -- WHERE u.usuario_estado = ?
            ORDER BY u.usuario_documento ASC, u.usuario_nombre ASC";
    $stmt = $this->conn->prepare($sql);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    // $stmt->bind_param('s', $estado);

    if ($stmt->execute()) {
      $result = $stmt->get_result();
      return $result->fetch_all(MYSQLI_ASSOC);
    }

    $this->logError("Execute failed (Obtener todos los usuarios): " . $stmt->error);
    return null;
  }

  public function obtenerUsuarioPorDocumento($documento)
  {
    $sql = "SELECT
            u.usuario_documento as documento,
            t.tipo_docu_id as tipoDocumentoId,
            t.tipo_docu_nombre as tipoDocumento,
            u.usuario_nombre as nombres,
            u.usuario_apellido as apellidos,
            u.usuario_telefono as telefono,
            u.usuario_direccion as direccion,
            u.usuario_correo as correo,
            u.usuario_contrasena as contrasena,
            r.rol_id as rol,
            r.rol_nombre as rolNombre,
            u.usuario_estado as estado
            FROM usuarios u
            INNER JOIN tipo_documento t
            ON u.tipo_docu_id = t.tipo_docu_id
            INNER JOIN roles r
            ON u.rol_id = r.rol_id
            WHERE u.usuario_documento = ?";
    $stmt = $this->conn->prepare($sql);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    $stmt->bind_param('i', $documento);

    if ($stmt->execute()) {
      $result = $stmt->get_result();

      if ($result->num_rows > 0) return $result->fetch_assoc();
    }

    $this->logError("Execute failed (Obtener usuario por documento): " . $stmt->error);
    return null;
  }

  public function editarUsuario($documento, $tipo_documento, $nombres, $apellidos, $telefono, $direccion, $correo, $rol)
  {
    $sql = "UPDATE {$this->tabla}
            SET tipo_docu_id = ?,
            usuario_nombre = ?,
            usuario_apellido = ?,
            usuario_telefono = ?,
            usuario_direccion = ?,
            usuario_correo = ?,
            rol_id = ?
            WHERE usuario_documento = ?";
    $stmt = $this->conn->prepare($sql);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    $stmt->bind_param("ississii", $tipo_documento, $nombres, $apellidos, $telefono, $direccion, $correo, $rol, $documento);

    if ($stmt->execute()) return true;

    $this->logError("Execute failed (Editar datos basicos usuario): " . $stmt->error);
    return null;
  }

  public function desactivarUsuario($documento)
  {
    $sql = "UPDATE {$this->tabla}
            SET usuario_estado = 'inactivo'
            WHERE usuario_documento = ?";
    $stmt = $this->conn->prepare($sql);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    $stmt->bind_param("i", $documento);

    if ($stmt->execute()) return true;

    $this->logError("Execute failed (Editar datos basicos usuario): " . $stmt->error);
    return null;
  }

  // PARA HACER
  public function cambiarContraseña(){
    return null;
  }

  private function logError($message)
  {
    error_log("[" . date("Y-m-d H:i:s") . "] $message" . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
  }
}
