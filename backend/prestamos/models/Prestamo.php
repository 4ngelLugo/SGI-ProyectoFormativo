<?php
require_once __DIR__ . '/../../config/Database.php';
class Prestamo
{
  private $conn;
  private Elemento $elemento_modelo;
  private Solicitante $solicitante_modelo;
  private $tabla_prestamos = 'prestamos';
  private $tabla_solicitantes = 'solicitantes';
  private $error_return = "";

  public function __construct($db, $elemento, $solicitante)
  {
    $this->conn = $db;
    $this->elemento_modelo = $elemento;
    $this->solicitante_modelo = $solicitante;
  }
  public function generarPrestamo(array $data)
  {
    try {
      $this->conn->begin_transaction();

      // 1. Insertar o actualizar solicitante si el documento es el mismo

      $solicitante = $this->solicitante_modelo->crearSolicitante($data);

      if (!isset($solicitante['success'])) {
        $this->error_return = "error al crear solicitante";
        throw new Exception("Error al crear solicitante");
      }

      // 2. Insertar préstamo
      $estado_prestamo_id = ($data['tipo_prestamo'] === 'reserva') ? 1 : 2; // En espera, Entregado

      $queryPrestamo = "INSERT INTO {$this->tabla_prestamos} (
        usuario_documento,
        solicitante_documento,
        prestamo_tipo,
        prestamo_fecha_solicitud,
        prestamo_fecha_entrega,
        prestamo_fecha_devolucion,
        prestamo_destino,
        prestamo_observacion,
        estado_prestamo_id
        ) VALUES (?, ?, ?, CURDATE(), ?, ?, ?, ?, ?)";

      $stmtPrestamo = $this->conn->prepare($queryPrestamo);

      if (!$stmtPrestamo) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmtPrestamo->bind_param(
        "sssssssi",
        $data['usuario_documento'],
        $data['identificacion'],
        $data['tipo_prestamo'],
        $data['fecha_entrega'],
        $data['fecha_devolucion'],
        $data['destino_general'],
        $data['observaciones'],
        $estado_prestamo_id
      );

      if (!$stmtPrestamo->execute()) {
        $this->error_return = "error al crear prestamo";
        throw new Exception("Execute failed (Crear prestamo): " . $stmtPrestamo->error);
      }

      // Obtener ID del préstamo recién creado
      $prestamo_id = $this->conn->insert_id;

      $queryElemento = "INSERT INTO prestamo_elementos (
          prestamo_id,
          elemento_codigo,
          prestamo_elemento_cantidad)
          VALUES (?, ?, ?)";
      $stmtElemento = $this->conn->prepare($queryElemento);

      if (!$stmtElemento) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $default = 1;

      // 3. Insertar elementos devolutivos
      if (!empty($data['devolutivos'][0])) {
        foreach ($data['devolutivos'] as $elemento_codigo) {
          $stmtElemento->bind_param(
            "isi",
            $prestamo_id,
            $elemento_codigo,
            $default
          );

          if (!$stmtElemento->execute()) {
            $this->error_return = "error al asignar devolutivo";
            throw new Exception("Execute failed (Asignar elemento devolutivo a prestamo): " . $stmtElemento->error);
          }

          $estado = $data['tipo_prestamo'] == "inmediato" ? 2 : 3;

          $cambiar_estado = $this->elemento_modelo->cambiarEstadoElemento($elemento_codigo, $estado);
          if (!isset($cambiar_estado['success'])) {
            $this->error_return = "error al asignar devolutivo";
            throw new Exception("Execute failed (Cambiar estado de elemento devolutivo): " . $stmtElemento->error);
          }
        }
      }

      // 4. Insertar elementos consumibles
      if (!empty($data['consumibles'][0]['codigo'])) {
        foreach ($data['consumibles'] as $elemento) {
          $stmtElemento->bind_param(
            "isi",
            $prestamo_id,
            $elemento['codigo'],
            $elemento['cantidad']
          );

          if (!$stmtElemento->execute()) {
            $this->error_return = "error al asignar consumible";
            throw new Exception("Execute failed (Asignar elemento consumible a prestamo): " . $stmtElemento->error);
          }

          $cambiar_cantidad = $this->elemento_modelo->cambiarCantidadConsumible($elemento['codigo'], "restar", $elemento['cantidad']);

          if (!isset($cambiar_cantidad['success'])) {
            $this->error_return = "error al asignar consumible";
            throw new Exception("Execute failed (Restar cantidad de elemento consumible): " . $stmtElemento->error);
          }
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
  public function obtenerTodosLosPrestamos()
  {
    try {
      $sql = "SELECT 
        p.prestamo_id as id,
        p.usuario_documento as usuarioDocumento,
        u.usuario_nombre as usuarioNombre,
        u.usuario_apellido as usuarioApellido,
        p.solicitante_documento as solicitanteDocumento,
        s.solicitante_nombre as solicitanteNombre,
        p.prestamo_tipo as prestamoTipo,
        p.prestamo_fecha_solicitud as prestamoFechaSolicitud,
        p.prestamo_fecha_entrega as prestamoFechaEntrega,
        p.prestamo_fecha_devolucion as prestamoFechaDevolucion,
        p.prestamo_destino as prestamoDestino,
        p.prestamo_observacion as prestamoObservacion,
        p.estado_prestamo_id as estadoId,
        e.estado_prestamo_nombre as estado
        FROM {$this->tabla_prestamos} p
        LEFT JOIN estados_prestamos e ON p.estado_prestamo_id = e.estado_prestamo_id
        LEFT JOIN usuarios u ON p.usuario_documento = u.usuario_documento
        LEFT JOIN {$this->tabla_solicitantes} s ON p.solicitante_documento = s.solicitante_documento
        ORDER BY FIELD(p.estado_prestamo_id, 3, 1, 2, 5, 4), p.prestamo_id DESC";
      $stmt = $this->conn->prepare($sql);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      if (!$stmt->execute()) {
        $this->error_return = "error al obtener prestamos";
        throw new Exception("Execute failed (Obtener todos los prestamos): " . $stmt->error);
      }

      // Obtiene el resultado de la consulta y verifica si hay filas
      $resultado = $stmt->get_result();
      return ["success" => true, "data" => $resultado->fetch_all(MYSQLI_ASSOC)];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerPrestamoPorID(int $prestamo_id)
  {
    try {
      $this->conn->begin_transaction();

      // 1. Obtener datos del prestamo, el usuario que lo aprobo y el solicitante
      $sqlPrestamo = "SELECT
        p.prestamo_id as id,
        p.usuario_documento,
        p.solicitante_documento,
        p.prestamo_tipo,
        p.prestamo_fecha_solicitud,
        p.prestamo_fecha_entrega,
        p.prestamo_fecha_devolucion,
        p.prestamo_destino,
        p.prestamo_observacion,
        p.estado_prestamo_id as estadoId,
        e.estado_prestamo_nombre as estado,
        u.usuario_nombre,
        u.usuario_apellido,
        s.solicitante_nombre,
        s.solicitante_telefono,
        s.solicitante_correo,
        s.solicitante_direccion
        FROM {$this->tabla_prestamos} p
        LEFT JOIN estados_prestamos e ON p.estado_prestamo_id = e.estado_prestamo_id
        LEFT JOIN usuarios u ON p.usuario_documento = u.usuario_documento
        LEFT JOIN {$this->tabla_solicitantes} s ON p.solicitante_documento = s.solicitante_documento
        WHERE p.prestamo_id = ?
        ORDER BY p.prestamo_id ASC";
      $stmtPrestamo = $this->conn->prepare($sqlPrestamo);

      if (!$stmtPrestamo) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmtPrestamo->bind_param("i", $prestamo_id);

      if (!$stmtPrestamo->execute()) {
        $this->error_return = "error al obtener prestamo";
        throw new Exception("Execute failed (Obtener prestamo por id): " . $stmtPrestamo->error);
      }

      $resultPrestamo = $stmtPrestamo->get_result();
      if ($resultPrestamo->num_rows <= 0) {
        $this->error_return = "no existe";
        throw new Exception("No se encontro ningun prestamo con el id proporcionado");
      }
      $prestamo = $resultPrestamo->fetch_assoc();

      // 2. Obtener datos de los elementos prestados
      $sqlElementos = "SELECT *
        FROM prestamo_elementos pe
        INNER JOIN elementos e
        ON pe.elemento_codigo = e.elemento_codigo
        WHERE pe.prestamo_id = ?";
      $stmtElementos = $this->conn->prepare($sqlElementos);

      if (!$stmtElementos) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmtElementos->bind_param("i", $prestamo_id);

      if (!$stmtElementos->execute()) {
        $this->error_return = "error al obtener prestamo";
        throw new Exception("Execute failed (Obtener prestamo por id): " . $stmtElementos->error);
      }

      $resultElementos = $stmtElementos->get_result();
      $elementos = $resultElementos->fetch_all(MYSQLI_ASSOC);

      $this->conn->commit();
      return [
        "prestamo" => $prestamo,
        "elementos" => $elementos
      ];
    } catch (Exception $e) {
      $this->conn->rollback();
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function editarObservacionPrestamo(int $prestamo_id, string $observacion)
  {
    try {

      $query = "UPDATE {$this->tabla_prestamos} 
        SET prestamo_observacion = ?
        WHERE prestamo_id = ?";
      $stmt = $this->conn->prepare($query);

      if (!$stmt) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmt->bind_param("si", $observacion, $prestamo_id);

      if (!$stmt->execute()) {
        $this->error_return = "error al editar prestamo";
        throw new Exception("Execute failed (Editar observacion de prestamo): " . $stmt->error);
      }

      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function cambiarEstadoPrestamo(int $prestamo_id, int $estado)
  {
    try {
      $this->conn->begin_transaction();

      $sqlPrestamo = "UPDATE {$this->tabla_prestamos}
        SET estado_prestamo_id = ?
        WHERE prestamo_id = ?";
      $stmtPrestamo = $this->conn->prepare($sqlPrestamo);

      if (!$stmtPrestamo) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmtPrestamo->bind_param("ii", $estado, $prestamo_id);

      if (!$stmtPrestamo->execute()) {
        $this->error_return = "error al editar prestamo";
        throw new Exception("Execute failed (Cambiar estado de prestamo): " . $stmtPrestamo->error);
      }

      if ($estado === 2) {
        $estado_elemento = 2;
      } else if ($estado === 5) {
        $estado_elemento = 1;
      }

      $sqlElementos = "SELECT * FROM prestamo_elementos
        WHERE prestamo_id = ?";
      $stmtElementos = $this->conn->prepare($sqlElementos);

      if (!$stmtElementos) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmtElementos->bind_param("i", $prestamo_id);

      if (!$stmtElementos->execute()) {
        $this->error_return = "error al editar prestamo";
        throw new Exception("Execute failed (Cambiar estado de elementos): " . $stmtElementos->error);
      }

      $resultado = $stmtElementos->get_result();
      if ($resultado->num_rows > 0) $elementos = $resultado->fetch_all(MYSQLI_ASSOC);

      foreach ($elementos as $elemento) {
        $cambiar_estado = $this->elemento_modelo->cambiarEstadoElemento($elemento['elemento_codigo'], $estado_elemento);

        if (!isset($cambiar_estado['success'])) {
          $this->error_return = "error al editar prestamo";
          throw new Exception("Execute failed (Cambiar estado de elemento): " . $stmtElementos->error);
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

  public function inhabilitarPrestamo(int $prestamo_id)
  {
    try {
      $this->conn->begin_transaction();

      $sqlPrestamo = "UPDATE {$this->tabla_prestamos}
      SET estado_prestamo_id = 4
      WHERE prestamo_id = ?"; // 4: Cancelado
      $stmtPrestamo = $this->conn->prepare($sqlPrestamo);

      if (!$stmtPrestamo) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmtPrestamo->bind_param("i", $prestamo_id);

      if (!$stmtPrestamo->execute()) {
        $this->error_return = "error al editar prestamo";
        throw new Exception("Execute failed (Cambiar estado de prestamo): " . $stmtPrestamo->error);
      }

      $estado_elementos = 1;

      $sqlElementos = "SELECT * FROM prestamo_elementos
        WHERE prestamo_id = ?";
      $stmtElementos = $this->conn->prepare($sqlElementos);

      if (!$stmtElementos) {
        throw new Exception("Prepare failed: " . $this->conn->error);
      }

      $stmtElementos->bind_param("i", $prestamo_id);

      if (!$stmtElementos->execute()) {
        $this->error_return = "error al editar prestamo";
        throw new Exception("Execute failed (Cambiar estado de elementos): " . $stmtElementos->error);
      }

      $resultado = $stmtElementos->get_result();
      if ($resultado->num_rows > 0) $elementos = $resultado->fetch_all(MYSQLI_ASSOC);

      foreach ($elementos as $elemento) {
        $cambiar_estado = $this->elemento_modelo->cambiarEstadoElemento($elemento['elemento_codigo'], $estado_elementos);

        if (!isset($cambiar_estado['success'])) {
          $this->error_return = "error al editar prestamo";
          throw new Exception("Execute failed (Cambiar estado de elemento): " . $stmtElementos->error);
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

  public function actualizarPrestamoCompleto(array $data)
  {
    try {
      $this->conn->begin_transaction();

      // 1. Actualizar préstamo
      $query = "UPDATE prestamo SET
                usuario_documento = ?,
                solicitante_documento = ?,
                prestamo_tipo = ?,
                prestamo_fecha_solicitud = ?,
                prestamo_fecha_entrega = ?,
                prestamo_fecha_devolucion = ?,
                prestamo_destino = ?,
                prestamo_observacion = ?
                WHERE prestamo_id = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param(
        "sssssssss",
        $data['usuario_documento'],
        $data['solicitante_documento'],
        $data['prestamo_tipo'],
        $data['prestamo_fecha_solicitud'],
        $data['prestamo_fecha_entrega'],
        $data['prestamo_fecha_devolucion'],
        $data['prestamo_destino'],
        $data['prestamo_observacion'],
        $data['prestamo_id']
      );

      if (!$stmt->execute()) {
        $stmt->close();
        throw new Exception("Error al editar préstamo: " . $this->conn->error);
      }
      $stmt->close();

      // 2. Eliminar elementos anteriores
      $query = "DELETE FROM prestamo_elementos WHERE prestamo_id = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("s", $data['prestamo_id']);
      if (!$stmt->execute()) {
        $stmt->close();
        throw new Exception("Error al eliminar elementos: " . $this->conn->error);
      }
      $stmt->close();

      // 3. Insertar nuevos devolutivos
      if (!empty($data['devolutivos'])) {
        $query = "INSERT INTO prestamo_elementos (prestamo_id, elemento_codigo) VALUES (?, ?)";
        $stmt = $this->conn->prepare($query);
        foreach ($data['devolutivos'] as $codigo) {
          $stmt->bind_param("ss", $data['prestamo_id'], $codigo);
          if (!$stmt->execute()) {
            $stmt->close();
            throw new Exception("Error al insertar devolutivo: " . $this->conn->error);
          }
        }
        $stmt->close();
      }

      // 4. Insertar nuevos consumibles
      if (!empty($data['consumibles'])) {
        $query = "INSERT INTO prestamo_elementos (prestamo_id, elemento_codigo) VALUES (?, ?)";
        $stmt = $this->conn->prepare($query);
        foreach ($data['consumibles'] as $codigo) {
          $stmt->bind_param("ss", $data['prestamo_id'], $codigo);
          if (!$stmt->execute()) {
            $stmt->close();
            throw new Exception("Error al insertar consumible: " . $this->conn->error);
          }
        }
        $stmt->close();
      }

      $this->conn->commit();
      return true;
    } catch (Exception $e) {
      $this->conn->rollback();
      throw $e;
    } finally {
      $this->conn->close();
    }
  }

  private function logError($message)
  {
    error_log("[" . date("Y-m-d H:i:s") . "] $message" . PHP_EOL, 3, __DIR__ . "/../../logs/php_errors.log");
  }
}
