<?php
require_once __DIR__ . '/../../config/Database.php'; 
class Prestamo{

    private $id;
    private $fecha;
    private $usuario;
    private $conn;

    public function __construct($id, $fecha, $usuario){
       $this->id = $id;
       $this->fecha = $fecha;
       $this->usuario = $usuario;

       $database = new Database();
       $this->conn = $database->getConnection();
    }

    public static function generarPrestamo(array $data) {
        $database = new Database();
        $conn = $database->getConnection();

        try {
            $conn->begin_transaction();

            // Determinar el estado del préstamo según el tipo de usuario
            // Por defecto: 1 = En espera (Instructor), 2 = Aprobado (Almacenista)
            $tipo_usuario = isset($data['typeuser']) ? $data['typeuser'] : '';
            if (strtolower($tipo_usuario) === 'almacenista') {
                $estado_prestamo_id = 2; // Aprobado
            } else {
                $estado_prestamo_id = 1; // En espera
            }

            // Usar el tipo de préstamo recibido o por defecto
            $tipo_prestamo = isset($data['tipo_prestamo']) ? $data['tipo_prestamo'] : 'Reserva';

            $usuario_documento = isset($data['identificacion']) ? $data['identificacion'] : null;
            $fecha_solicitud = isset($data['fecha_solicitud']) ? $data['fecha_solicitud'] : null;
            $fecha_entrega = isset($data['fecha_entrega']) ? $data['fecha_entrega'] : null;
            $fecha_devolucion = isset($data['fecha_devolucion']) ? $data['fecha_devolucion'] : null;
            $observaciones = isset($data['observaciones']) ? $data['observaciones'] : '';

            if (empty($usuario_documento)) {
                throw new Exception("El campo identificacion (usuario_documento) es obligatorio.");
            }

            $query = "INSERT INTO prestamo (
                prestamo_id,
                usuario_documento, 
                prestamo_fecha_solicitud, 
                prestamo_fecha_entrega, 
                prestamo_fecha_devolucion, 
                prestamo_observacion, 
                estado_prestamo_id, 
                tipo_prestamo
            ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)";

            $stmt = $conn->prepare($query);
            $stmt->bind_param(
                "sssssis",
                $usuario_documento,
                $fecha_solicitud,
                $fecha_entrega,
                $fecha_devolucion,
                $observaciones,
                $estado_prestamo_id,
                $tipo_prestamo
            );

            if (!$stmt->execute()) {
                throw new Exception("Error al crear préstamo: " . $stmt->error);
            }

            // Obtener el UUID generado
            $result = $conn->query("SELECT prestamo_id FROM prestamo ORDER BY prestamo_fecha_solicitud DESC LIMIT 1");
            $row = $result->fetch_assoc();
            $prestamo_id = $row['prestamo_id'];

            // Insertar elementos devolutivos
            if (isset($data['devolutivos']) && is_array($data['devolutivos'])) {
                $queryElemento = "INSERT INTO prestamo_elementos (prestamo_id, elemento_codigo) VALUES (?, ?)";
                $stmtElemento = $conn->prepare($queryElemento);

                foreach ($data['devolutivos'] as $codigo => $elemento) {
                    $elemento_codigo = $elemento['codigo'];
                    $stmtElemento->bind_param("ss", $prestamo_id, $elemento_codigo);
                    if (!$stmtElemento->execute()) {
                        throw new Exception("Error al insertar elemento devolutivo: " . $stmtElemento->error);
                    }
                }
            }

            // Insertar elementos consumibles
            if (isset($data['consumibles']) && is_array($data['consumibles'])) {
                $queryElemento = "INSERT INTO prestamo_elementos (prestamo_id, elemento_codigo) VALUES (?, ?)";
                $stmtElemento = $conn->prepare($queryElemento);

                foreach ($data['consumibles'] as $codigo => $elemento) {
                    $elemento_codigo = $elemento['codigo'];
                    $stmtElemento->bind_param("ss", $prestamo_id, $elemento_codigo);
                    if (!$stmtElemento->execute()) {
                        throw new Exception("Error al insertar elemento consumible: " . $stmtElemento->error);
                    }
                }
            }

            $conn->commit();
            $database->closeConnection();

            return $prestamo_id;

        } catch (Exception $e) {
            $conn->rollback();
            $database->closeConnection();
            throw $e;
        }
    }

    public static function listarPrestamos() {
        $database = new Database();
        $conn = $database->getConnection();

        $prestamos = [];
        $query = "SELECT 
                    p.prestamo_id,
                    p.usuario_documento,
                    p.prestamo_fecha_solicitud,
                    p.prestamo_fecha_entrega,
                    p.prestamo_fecha_devolucion,
                    p.prestamo_observacion,
                    p.estado_prestamo_id,
                    p.tipo_prestamo,
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

    public static function editarPrestamo($prestamo_id, $fecha_devolucion, $estado_prestamo_id) {
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

    public static function inhabilitarPrestamo($prestamo_id) {
        $database = new Database();
        $conn = $database->getConnection();

        $query = "UPDATE prestamo SET estado_prestamo_id = 0 WHERE prestamo_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $prestamo_id);

        $result = $stmt->execute();
        $stmt->close();
        $database->closeConnection();

        return $result;
    }

    public function getId(){
        return $this->id;   
    }
    public function getFecha(){
        return $this->fecha;
    }
    public function getUsuario(){
        return $this->usuario;
    }
    public function setId($id){
        $this->id = $id;
    }
    public function setFecha($fecha){
        $this->fecha = $fecha;
    }
    public function setUsuario($usuario){
        $this->usuario = $usuario;
    }
}