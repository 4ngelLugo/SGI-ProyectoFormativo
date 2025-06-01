<?php
class Rol
{
  private $conn;

  private $tabla = 'roles';
  private $tabla_permisos = "permisos";
  private $tabla_roles_permisos = "roles_permisos";

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function guardarRol($nombre, array $permisos_ids)
  {
    try {
      $this->conn->begin_transaction();

      $rol_query = "INSERT INTO  {$this->tabla} (rol_nombre) VALUES (?)";
      $rol_stmt = $this->conn->prepare($rol_query);

      if (!$rol_stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $rol_stmt->bind_param("s", $nombre);

      if (!$rol_stmt->execute()) throw new Exception("Excute failed (Guardar rol): " . $rol_stmt->error);

      $rol_id = $this->conn->insert_id;

      $permisos_sql = "INSERT INTO {$this->tabla_roles_permisos} (rol_id, permiso_id) VALUES (?, ?)";
      $permisos_stmt = $this->conn->prepare($permisos_sql);

      if (!$permisos_stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      foreach ($permisos_ids as $permiso) {
        $permisos_stmt->bind_param("ii", $rol_id, $permiso);

        if (!$permisos_stmt->execute()) throw new Exception("Excute failed (Guardar permisos de rol): " . $permisos_stmt->error);
      }

      $this->conn->commit();
      return true;
    } catch (Exception $e) {
      $this->logError($e->getMessage());
      $this->conn->rollback();
      return null;
    }
  }

  public function obtenerTodosLosRoles()
  {
    $sql = "SELECT 
            rol_id as id,
            rol_nombre as nombre,
            rol_estado as estado
            FROM {$this->tabla}";
    $stmt = $this->conn->prepare($sql);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    if ($stmt->execute()) {
      $result = $stmt->get_result();
      return $result->fetch_all(MYSQLI_ASSOC);
    }

    $this->logError("Execute failed (Obtener todos los roles): " . $stmt->error);
    return null;
  }

  public function obtenerRolPorId($id)
  {
    $sql_rol = "SELECT
                rol_id as id,
                rol_nombre as nombre,
                rol_estado as estado
                FROM {$this->tabla}
                WHERE rol_id = ?";
    $stmt_rol = $this->conn->prepare($sql_rol);

    if (!$stmt_rol) {
      $this->logError("Prepare failed (Rol): " . $this->conn->error);
      return null;
    }

    $stmt_rol->bind_param("i", $id);

    if (!$stmt_rol->execute()) {
      $this->logError("Execute failed (Rol): " . $stmt_rol->error);
      return null;
    }

    $rolResult = $stmt_rol->get_result();
    $rol = $rolResult->fetch_assoc();

    $sql_permisos = "SELECT
                    p.permiso_id as permisoId
                    FROM {$this->tabla_permisos} p
                    INNER JOIN {$this->tabla_roles_permisos} rp
                    ON rp.permiso_id = p.permiso_id
                    WHERE rp.rol_id = ?
                    ";

    $stmt_permisos = $this->conn->prepare($sql_permisos);

    if (!$stmt_permisos) {
      $this->logError("Prepare failed (Permisos): " . $this->conn->error);
      return null;
    }

    $stmt_permisos->bind_param("i", $id);

    if (!$stmt_permisos->execute()) {
      $this->logError("Execute failed (Permisos): " . $stmt_permisos->error);
      return null;
    }

    $permisoResult = $stmt_permisos->get_result();
    $permisos = [];

    while ($row = $permisoResult->fetch_assoc()) {
      $permisos[] = $row['permisoId'];
    }

    $rol['permisos'] = $permisos;

    return $rol;
  }

  public function obtenerRolPorNombre($nombre)
  {
    $sql = "SELECT * FROM {$this->tabla} WHERE rol_nombre = ?";
    $stmt = $this->conn->prepare($sql);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    $stmt->bind_param("s", $nombre);

    if ($stmt->execute()) {
      $result = $stmt->get_result();

      if ($result->num_rows > 0) return $result->fetch_assoc();
    }

    $this->logError("Execute failed (Obtener rol por nombre): " . $stmt->error);
    return null;
  }

  public function editarRol($id, $nombre, array $permisos_ids)
  {
    try {
      $this->conn->begin_transaction();

      $rol_sql = "UPDATE {$this->tabla} SET rol_nombre = ? WHERE rol_id = ?";
      $rol_stmt = $this->conn->prepare($rol_sql);

      if (!$rol_stmt) throw new Exception("Prepare failed: " . $this->conn->error);

      $rol_stmt->bind_param("si", $nombre, $id);

      if (!$rol_stmt->execute()) throw new Exception("Excute failed (Guardar rol): " . $rol_stmt->error);

      $delete_permisos_sql = "DELETE FROM {$this->tabla_roles_permisos} WHERE rol_id = ?";
      $delete_permisos_stmt = $this->conn->prepare($delete_permisos_sql);

      if (!$delete_permisos_stmt) throw new Exception("Prepare failed: " . $this->conn->error);

      $delete_permisos_stmt->bind_param("i", $id);

      if (!$delete_permisos_stmt->execute()) throw new Exception("Excute failed (Guardar permisos de rol): " . $delete_permisos_stmt->error);

      $permisos_sql = "INSERT INTO {$this->tabla_roles_permisos} (rol_id, permiso_id) VALUES (?, ?)";
      $permisos_stmt = $this->conn->prepare($permisos_sql);

      if (!$permisos_stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      foreach ($permisos_ids as $permiso) {
        $permisos_stmt->bind_param("ii", $id, $permiso);

        if (!$permisos_stmt->execute()) throw new Exception("Excute failed (Guardar permisos de rol): " . $permisos_stmt->error);
      }

      $this->conn->commit();
      return true;
    } catch (Exception $e) {
      $this->logError($e->getMessage());
      $this->conn->rollback();
      return null;
    }
  }

  public function desactivarRol($id)
  {
    $sql = "UPDATE {$this->tabla} SET rol_estado = 'inactivo' WHERE rol_id = ?";
    $stmt = $this->conn->prepare($sql);

    if (!$stmt) {
      $this->logError("Prepare failed: " . $this->conn->error);
      return null;
    }

    $stmt->bind_param("i", $id);

    if ($stmt->execute()) return true;

    $this->logError("Execute failed (Deshabilitar rol): " . $stmt->error);
    return null;
  }

  private function logError($message)
  {
    error_log("[" . date("Y-m-d H:i:s") . "] $message" . PHP_EOL, 3, __DIR__ . "/../../../logs/php_errors.log");
  }
}
