<?php
class Rol
{
  private $conn;

  private $tabla = 'roles';
  private $tabla_permisos = "permisos";
  private $tabla_roles_permisos = "roles_permisos";
  private $error_return = "";

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

      if (!$rol_stmt->execute()) {
        $this->error_return = "error al guardar rol";
        throw new Exception("Execute failed (Guardar rol): " . $rol_stmt->error);
      }

      $rol_id = $this->conn->insert_id;

      $permisos_sql = "INSERT INTO {$this->tabla_roles_permisos} (rol_id, permiso_id) VALUES (?, ?)";
      $permisos_stmt = $this->conn->prepare($permisos_sql);

      if (!$permisos_stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      foreach ($permisos_ids as $permiso) {
        $permisos_stmt->bind_param("ii", $rol_id, $permiso);

        if (!$permisos_stmt->execute()) {
          $this->error_return = "error al guardar rol";
          throw new Exception("Execute failed (Asignar permiso a rol): " . $permisos_stmt->error);
        }
      }

      $this->conn->commit();
      return ["success" => true];
    } catch (Exception $e) {
      $this->conn->rollback();
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerTodosLosRoles()
  {
    try {
      $sql = "SELECT 
        rol_id as id,
        rol_nombre as nombre,
        rol_estado as estado
        FROM {$this->tabla}";
      $stmt = $this->conn->prepare($sql);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener roles";
        throw new Exception("Execute failed (Obtener todos los roles): " . $stmt->error);
      }

      // Obtiene el resultado de la consulta y verifica si hay filas
      $resultado = $stmt->get_result();
      return ["success" => true, "data" => $resultado->fetch_all(MYSQLI_ASSOC)];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerRolPorId($id)
  {
    try {
      $sql_rol = "SELECT
        rol_id as id,
        rol_nombre as nombre,
        rol_estado as estado
        FROM {$this->tabla}
        WHERE rol_id = ?";
      $stmt_rol = $this->conn->prepare($sql_rol);

      if (!$stmt_rol) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt_rol->bind_param("i", $id);

      if (!$stmt_rol->execute()) {
        $this->error_return = "error al obtener rol";
        throw new Exception("Execute failed (Obtener rol por ID): " . $stmt_rol->error);
      }

      $rolResult = $stmt_rol->get_result();
      if ($rolResult->num_rows > 0) $rol = $rolResult->fetch_assoc();

      $sql_permisos = "SELECT
        p.permiso_id as id,
        p.permiso_nombre as nombre
        FROM {$this->tabla_permisos} p
        INNER JOIN {$this->tabla_roles_permisos} rp
        ON rp.permiso_id = p.permiso_id
        WHERE rp.rol_id = ?";
      $stmt_permisos = $this->conn->prepare($sql_permisos);

      if (!$stmt_permisos) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt_permisos->bind_param("i", $id);

      if (!$stmt_permisos->execute()) {
        $this->error_return = "error al obtener rol";
        throw new Exception("Execute failed (Obtener permisos): " . $stmt_permisos->error);
      }

      $permisoResult = $stmt_permisos->get_result();
      if ($permisoResult->num_rows > 0) $permisos = $permisoResult->fetch_all(MYSQLI_ASSOC);

      $rol['permisos'] = $permisos;

      return $rol;
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerRolPorNombre($nombre)
  {
    try {
      $sql = "SELECT
        rol_id as id,
        rol_nombre as nombre,
        rol_estado as estado
        FROM {$this->tabla}
        WHERE rol_nombre = ?";
      $stmt = $this->conn->prepare($sql);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("s", $nombre);

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener rol";
        throw new Exception("Execute failed (Obtener rol por nombre): " . $stmt->error);
      }

      // Obtiene el resultado de la consulta y verifica si hay filas
      $resultado = $stmt->get_result();
      if ($resultado->num_rows > 0) return $resultado->fetch_assoc();
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function editarRol($id, $nombre, array $permisos_ids)
  {
    try {
      $this->conn->begin_transaction();

      $rol_sql = "UPDATE {$this->tabla} SET rol_nombre = ? WHERE rol_id = ?";
      $rol_stmt = $this->conn->prepare($rol_sql);

      if (!$rol_stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $rol_stmt->bind_param("si", $nombre, $id);

      if (!$rol_stmt->execute()) {
        $this->error_return = "error al editar rol";
        throw new Exception("Execute failed (Editar rol): " . $rol_stmt->error);
      }

      $delete_permisos_sql = "DELETE FROM {$this->tabla_roles_permisos} WHERE rol_id = ?";
      $delete_permisos_stmt = $this->conn->prepare($delete_permisos_sql);

      if (!$delete_permisos_stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $delete_permisos_stmt->bind_param("i", $id);

      if (!$delete_permisos_stmt->execute()) {
        $this->error_return = "error al editar permisos";
        throw new Exception("Execute failed (Borrar permisos a rol): " . $delete_permisos_stmt->error);
      }

      $permisos_sql = "INSERT INTO {$this->tabla_roles_permisos} (rol_id, permiso_id) VALUES (?, ?)";
      $permisos_stmt = $this->conn->prepare($permisos_sql);

      if (!$permisos_stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      foreach ($permisos_ids as $permiso) {
        $permisos_stmt->bind_param("ii", $id, $permiso);

        if (!$permisos_stmt->execute()) {
          $this->error_return = "error al editar permisos";
          throw new Exception("Execute failed (Asignar permiso a rol nuevamente): " . $permisos_stmt->error);
        }
      }

      $this->conn->commit();
      return ["success" => true];
    } catch (Exception $e) {
      $this->conn->rollback();
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function desactivarRol($id)
  {
    try {
      $sql = "UPDATE {$this->tabla} SET rol_estado = 'inactivo' WHERE rol_id = ?";
      $stmt = $this->conn->prepare($sql);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("i", $id);

      if (!$stmt->execute()) {
        $this->error_return = "error al desactivar rol";
        throw new Exception("Execute failed (Deshabilitar rol): " . $stmt->error);
      }

      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  private function logError($message)
  {
    error_log("[" . date("Y-m-d H:i:s") . "] $message" . PHP_EOL, 3, __DIR__ . "/../../../logs/php_errors.log");
  }
}
