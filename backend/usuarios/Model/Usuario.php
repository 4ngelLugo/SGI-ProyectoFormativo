<?php
class UsuarioModel
{
  private $conn;
  private $tabla = "usuarios";
  private $error_return = "";

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function guardarUsuario(array $datos)
  {
    try {
      $query = "INSERT INTO {$this->tabla} (
        usuario_documento,
        tipo_docu_id,
        usuario_nombre,
        usuario_apellido,
        usuario_telefono,
        usuario_correo,
        usuario_contrasena,
        rol_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param(
        "iississi",
        $datos['documento'],
        $datos['tipo_documento'],
        $datos['nombres'],
        $datos['apellidos'],
        $datos['telefono'],
        $datos['correo'],
        $datos['contrasena'],
        $datos['rol']
      );

      if (!$stmt->execute()) {
        $this->error_return = "error al guardar usuario";
        throw new Exception("Execute failed (Crear usuario): " . $stmt->error);
      }

      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerTodosLosUsuarios()
  {
    try {
      $sql = "SELECT
        u.usuario_documento as documento,
        t.tipo_docu_nombre as tipoDocumento,
        u.usuario_nombre as nombres,
        u.usuario_apellido as apellidos,
        u.usuario_telefono as telefono,
        u.usuario_correo as correo,
        u.usuario_contrasena as contrasena,
        r.rol_nombre as rol,
        u.usuario_estado as estado
        FROM usuarios u
        INNER JOIN tipo_documento t
        ON u.tipo_docu_id = t.tipo_docu_id
        INNER JOIN roles r
        ON u.rol_id = r.rol_id
        ORDER BY u.usuario_documento ASC, u.usuario_nombre ASC";
      $stmt = $this->conn->prepare($sql);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener usuarios";
        throw new Exception("Execute failed (Obtener todos los usuarios): " . $stmt->error);
      }

      // Obtiene el resultado de la consulta y verifica si hay filas
      $resultado = $stmt->get_result();
      return ["success" => true, "data" => $resultado->fetch_all(MYSQLI_ASSOC)];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerUsuarioPorDocumento(int $documento)
  {
    try {
      $sql = "SELECT
      u.usuario_documento as documento,
      t.tipo_docu_id as tipoDocumentoId,
      t.tipo_docu_nombre as tipoDocumento,
      u.usuario_nombre as nombres,
      u.usuario_apellido as apellidos,
      u.usuario_telefono as telefono,
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
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param('i', $documento);

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener usuario";
        throw new Exception("Execute failed (Obtener usuario por documento): " . $stmt->error);
      }

      // Obtiene el resultado de la consulta y verifica si hay filas
      $resultado = $stmt->get_result();
      if ($resultado->num_rows > 0) return $resultado->fetch_assoc();
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

    public function obtenerUsuarioPorCorreo(String $correo)
  {
    try {
      $sql = "SELECT
      u.usuario_documento as documento,
      t.tipo_docu_id as tipoDocumentoId,
      t.tipo_docu_nombre as tipoDocumento,
      u.usuario_nombre as nombres,
      u.usuario_apellido as apellidos,
      u.usuario_telefono as telefono,
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
      WHERE u.usuario_correo = ?";
      $stmt = $this->conn->prepare($sql);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param('s', $correo);

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener usuario";
        throw new Exception("Execute failed (Obtener usuario por correo): " . $stmt->error);
      }

      // Obtiene el resultado de la consulta y verifica si hay filas
      $resultado = $stmt->get_result();
      if ($resultado->num_rows > 0) return $resultado->fetch_assoc();
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function editarUsuario(array $datos)
  {
    try {
      $sql = "UPDATE {$this->tabla} SET
        tipo_docu_id = ?,
        usuario_nombre = ?,
        usuario_apellido = ?,
        usuario_telefono = ?,
        usuario_correo = ?
        WHERE usuario_documento = ?";
      $stmt = $this->conn->prepare($sql);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param(
        "issisi",
        $datos['tipo_documento'],
        $datos['nombres'],
        $datos['apellidos'],
        $datos['telefono'],
        $datos['correo'],
        $datos['documento']
      );

      if (!$stmt->execute()) {
        $this->error_return = "error al editar usuario";
        throw new Exception("Execute failed (Editar usuario): " . $stmt->error);
      }

      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function desactivarUsuario(int $documento)
  {
    try {
      $sql = "UPDATE {$this->tabla}
            SET usuario_estado = 'inactivo'
            WHERE usuario_documento = ?";
      $stmt = $this->conn->prepare($sql);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("i", $documento);

      if (!$stmt->execute()) {
        $this->error_return = "error al desactivar usuario";
        throw new Exception("Execute failed (Desactivar usuario): " . $stmt->error);
      }

      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  // PARA HACER
  public function cambiarContraseña()
  {
    return null;
  }

  private function logError($message)
  {
    error_log("[" . date("Y-m-d H:i:s") . "] $message" . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
  }
}
