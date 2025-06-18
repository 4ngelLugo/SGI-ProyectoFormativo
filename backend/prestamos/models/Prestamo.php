<?php
require_once __DIR__ . '/../../config/Database.php';
class Prestamo
{

    private $id;
    private $fecha;
    private $usuario;
    private $conn;

    public function __construct($id, $fecha, $usuario)
    {
        $this->id = $id;
        $this->fecha = $fecha;
        $this->usuario = $usuario;

        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public static function generarPrestamo(array $data)
    {
        $database = new Database();
        $conn = $database->getConnection();

        if (
            empty($data['identificacion']) ||
            empty($data['nombre_apellido']) ||
            empty($data['correo']) ||
            empty($data['telefono']) ||
            empty($data['direccion'])
        ) {
            throw new Exception("Faltan datos del solicitante");
        }

        try {
            $conn->begin_transaction();

            // 1. Insertar o actualizar solicitante
            $querySolicitante = "INSERT INTO solicitantes (
                solicitante_documento, 
                solicitante_nombre, 
                solicitante_correo, 
                solicitante_telefono, 
                solicitante_direccion
            ) VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                solicitante_nombre = VALUES(solicitante_nombre),
                solicitante_correo = VALUES(solicitante_correo),
                solicitante_telefono = VALUES(solicitante_telefono),
                solicitante_direccion = VALUES(solicitante_direccion)";

            $stmtSolicitante = $conn->prepare($querySolicitante);
            $stmtSolicitante->bind_param(
                "sssss",
                $data['identificacion'],
                $data['nombre_apellido'],
                $data['correo'],
                $data['telefono'],
                $data['direccion']
            );

            if (!$stmtSolicitante->execute()) {
                throw new Exception("Error al registrar solicitante: " . $stmtSolicitante->error);
            }

            // 2. Insertar préstamo
            $tipoPrestamo = $data['usertype'] === 'Instructor' ? 'Reserva' : 'Prestamo inmediato';
            $estado_prestamo_id = ($tipoPrestamo === 'Almacenista') ? 1 : 2; // 1: En espera, 2: Aprobado

            $queryPrestamo = "INSERT INTO prestamo (
                prestamo_id,
                usuario_documento,
                solicitante_documento,
                prestamo_tipo,
                prestamo_fecha_solicitud,
                prestamo_fecha_entrega,
                prestamo_fecha_devolucion,
                prestamo_destino,
                prestamo_observacion,
                estado_prestamo_id
            ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            $stmtPrestamo = $conn->prepare($queryPrestamo);
            $stmtPrestamo->bind_param(
                "ssssssssi",
                $data['id_usuario'],
                $data['identificacion'],
                $tipoPrestamo,
                $data['fecha_solicitud'],
                $data['fecha_entrega'],
                $data['fecha_devolucion'],
                $data['destino_general'],
                $data['observaciones'],
                $estado_prestamo_id
            );

            if (!$stmtPrestamo->execute()) {
                throw new Exception("Error al crear préstamo: " . $stmtPrestamo->error);
            }

            // Obtener ID del préstamo recién creado
            $prestamo_id = $conn->insert_id;

            // 3. Insertar elementos devolutivos
            if (!empty($data['devolutivos'])) {
                $queryElemento = "INSERT INTO prestamo_elementos (prestamo_id, elemento_codigo) VALUES (?, ?)";
                $stmtElemento = $conn->prepare($queryElemento);

                foreach ($data['devolutivos'] as $elemento_codigo) {
                    $stmtElemento->bind_param("ss", $prestamo_id, $elemento_codigo);
                    if (!$stmtElemento->execute()) {
                        throw new Exception("Error al insertar elemento devolutivo: " . $stmtElemento->error);
                    }
                }
            }

            // 4. Insertar elementos consumibles
            if (!empty($data['consumibles'])) {
                $queryElemento = "INSERT INTO prestamo_elementos (prestamo_id, elemento_codigo) VALUES (?, ?)";
                $stmtElemento = $conn->prepare($queryElemento);

                foreach ($data['consumibles'] as $elemento_codigo) {
                    $stmtElemento->bind_param("ss", $prestamo_id, $elemento_codigo);
                    if (!$stmtElemento->execute()) {
                        throw new Exception("Error al insertar elemento consumible: " . $stmtElemento->error);
                    }
                }
            }

            $conn->commit();
            return ['success' => true, 'prestamo_id' => $prestamo_id];
        } catch (Exception $e) {
            $conn->rollback();
            return ['success' => false, 'error' => $e->getMessage()];
        } finally {
            $database->closeConnection();
        }
    }

    public static function listarPrestamos()
    {
        $database = new Database();
        $conn = $database->getConnection();

        $prestamos = [];
        $query = "SELECT 
                p.prestamo_id,
                p.usuario_documento,
                p.solicitante_documento,
                p.prestamo_tipo,
                p.prestamo_fecha_solicitud,
                p.prestamo_fecha_entrega,
                p.prestamo_fecha_devolucion,
                p.prestamo_destino,
                p.prestamo_observacion,
                p.estado_prestamo_id,
                e.estado_prestamo_nombre
              FROM prestamo p
              LEFT JOIN estados_prestamos e ON p.estado_prestamo_id = e.estado_prestamo_id
              ORDER BY p.prestamo_fecha_solicitud DESC";

        $result = $conn->query($query);

        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $prestamos[] = $row;
            }
        }

        $database->closeConnection();
        return $prestamos;
    }


    public static function editarPrestamo($prestamo_id, $fecha_devolucion, $estado_prestamo_id)
    {
        $database = new Database();
        $conn = $database->getConnection();

        $query = "UPDATE prestamo SET prestamo_fecha_devolucion = ?, estado_prestamo_id = ? WHERE prestamo_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sis", $fecha_devolucion, $estado_prestamo_id, $prestamo_id);

        $result = $stmt->execute();
        $stmt->close();
        $database->closeConnection();

        return $result;
    }

    public static function inhabilitarPrestamo($prestamo_id)
    {
        $database = new Database();
        $conn = $database->getConnection();

        $query = "UPDATE prestamo SET estado_prestamo_id = 4 WHERE prestamo_id = ?"; //4 es Inhabilitado
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $prestamo_id);

        $result = $stmt->execute();
        $stmt->close();
        $database->closeConnection();

        return $result;
    }

    public static function getSolicitanteByIdentificacion(string $identificacion)
    {
        $database = new Database();
        $conn = $database->getConnection();

        $query = "SELECT 
                solicitante_documento, 
                solicitante_nombre, 
                solicitante_correo, 
                solicitante_telefono, 
                solicitante_direccion
              FROM solicitantes
              WHERE solicitante_documento = ?";

        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $identificacion);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_assoc();
    }

    public static function actualizarPrestamoCompleto(array $data)
{
    $database = new Database();
    $conn = $database->getConnection();

    try {
        $conn->begin_transaction();

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
        $stmt = $conn->prepare($query);
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
            throw new Exception("Error al actualizar préstamo: " . $conn->error);
        }
        $stmt->close();

        // 2. Eliminar elementos anteriores
        $query = "DELETE FROM prestamo_elementos WHERE prestamo_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $data['prestamo_id']);
        if (!$stmt->execute()) {
            $stmt->close();
            throw new Exception("Error al eliminar elementos: " . $conn->error);
        }
        $stmt->close();

        // 3. Insertar nuevos devolutivos
        if (!empty($data['devolutivos'])) {
            $query = "INSERT INTO prestamo_elementos (prestamo_id, elemento_codigo) VALUES (?, ?)";
            $stmt = $conn->prepare($query);
            foreach ($data['devolutivos'] as $codigo) {
                $stmt->bind_param("ss", $data['prestamo_id'], $codigo);
                if (!$stmt->execute()) {
                    $stmt->close();
                    throw new Exception("Error al insertar devolutivo: " . $conn->error);
                }
            }
            $stmt->close();
        }

        // 4. Insertar nuevos consumibles
        if (!empty($data['consumibles'])) {
            $query = "INSERT INTO prestamo_elementos (prestamo_id, elemento_codigo) VALUES (?, ?)";
            $stmt = $conn->prepare($query);
            foreach ($data['consumibles'] as $codigo) {
                $stmt->bind_param("ss", $data['prestamo_id'], $codigo);
                if (!$stmt->execute()) {
                    $stmt->close();
                    throw new Exception("Error al insertar consumible: " . $conn->error);
                }
            }
            $stmt->close(); 
        }

        $conn->commit();
        return true;

    } catch (Exception $e) {
        $conn->rollback();
        throw $e;
    }
}

    public static function obtenerPrestamoCompleto(string $prestamo_id)
    {
        $database = new Database();
        $conn = $database->getConnection();

        try {
            // 1. Obtener préstamo
            $query = "SELECT p.*, e.estado_prestamo_nombre 
                      FROM prestamo p
                      LEFT JOIN estados_prestamos e ON p.estado_prestamo_id = e.estado_prestamo_id
                      WHERE p.prestamo_id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("s", $prestamo_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $prestamo = $result->fetch_assoc();

            if (!$prestamo) {
                throw new Exception("Préstamo no encontrado");
            }

            // 2. Obtener solicitante
            $query = "SELECT * FROM solicitantes WHERE solicitante_documento = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("s", $prestamo['solicitante_documento']);
            $stmt->execute();
            $result = $stmt->get_result();
            $solicitante = $result->fetch_assoc();

            // 3. Obtener elementos devolutivos
            $query = "SELECT e.* FROM prestamo_elementos pe
                      JOIN elementos e ON pe.elemento_codigo = e.elemento_codigo
                      WHERE pe.prestamo_id = ? AND e.elemento_tipo = 'devolutivo'";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("s", $prestamo_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $devolutivos = [];
            while ($row = $result->fetch_assoc()) {
                $devolutivos[] = $row;
            }

            // 4. Obtener elementos consumibles
            $query = "SELECT e.* FROM prestamo_elementos pe
                      JOIN elementos e ON pe.elemento_codigo = e.elemento_codigo
                      WHERE pe.prestamo_id = ? AND e.elemento_tipo = 'consumible'";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("s", $prestamo_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $consumibles = [];
            while ($row = $result->fetch_assoc()) {
                $consumibles[] = $row;
            }

            // 5. Obtener todos los elementos (para Select2 en edición)
            $query = "SELECT elemento_codigo, elemento_nombre, elemento_tipo FROM elementos";
            $result = $conn->query($query);
            $todos_elementos = [];
            while ($row = $result->fetch_assoc()) {
                $todos_elementos[] = $row;
            }

            return [
                "prestamo" => $prestamo,
                "solicitante" => $solicitante,
                "devolutivos" => $devolutivos,
                "consumibles" => $consumibles,
                "todos_elementos" => $todos_elementos
            ];
        } catch (Exception $e) {
            throw new Exception("Error en modelo: " . $e->getMessage());
        }
    }

    public static function actualizarElementos(string $prestamo_id, array $devolutivos = [], array $consumibles = [])
    {
        $database = new Database();
        $conn = $database->getConnection();

        try {
            // Insertar devolutivos
            if (!empty($devolutivos)) {
                $query = "INSERT INTO prestamo_elementos (prestamo_id, elemento_codigo) VALUES (?, ?)";
                $stmt = $conn->prepare($query);

                foreach ($devolutivos as $codigo) {
                    $stmt->bind_param("ss", $prestamo_id, $codigo);
                    if (!$stmt->execute()) {
                        throw new Exception("Error al insertar devolutivos: " . $stmt->error);
                    }
                }
            }

            // Insertar consumibles
            if (!empty($consumibles)) {
                $query = "INSERT INTO prestamo_elementos (prestamo_id, elemento_codigo) VALUES (?, ?)";
                $stmt = $conn->prepare($query);

                foreach ($consumibles as $codigo) {
                    $stmt->bind_param("ss", $prestamo_id, $codigo);
                    if (!$stmt->execute()) {
                        throw new Exception("Error al insertar consumibles: " . $stmt->error);
                    }
                }
            }
        } catch (Exception $e) {
            $conn->rollback();
            throw $e;
        }
    }


    public function getId()
    {
        return $this->id;
    }
    public function getFecha()
    {
        return $this->fecha;
    }
    public function getUsuario()
    {
        return $this->usuario;
    }
    public function setId($id)
    {
        $this->id = $id;
    }
    public function setFecha($fecha)
    {
        $this->fecha = $fecha;
    }
    public function setUsuario($usuario)
    {
        $this->usuario = $usuario;
    }
}
