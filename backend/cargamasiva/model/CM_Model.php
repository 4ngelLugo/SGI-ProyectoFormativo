<?php
require_once '../../config/Database.php';

class CM_Model {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function existeElemento($codigo) {
        try {
            $sql = "SELECT COUNT(*) as count FROM elementos WHERE elemento_codigo = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param('s', $codigo);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            
            return $row['count'] > 0;
        } catch (Exception $e) {
            error_log("Error en existeElemento: " . $e->getMessage());
            return false;
        }
    }

    public function existeCategoria($id) {
        try {
            $sql = "SELECT COUNT(*) as count FROM categorias WHERE categoria_id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            
            return $row['count'] > 0;
        } catch (Exception $e) {
            error_log("Error en existeCategoria: " . $e->getMessage());
            return false;
        }
    }

    public function existeArea($id) {
        try {
            $sql = "SELECT COUNT(*) as count FROM areas WHERE area_id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            
            return $row['count'] > 0;
        } catch (Exception $e) {
            error_log("Error en existeArea: " . $e->getMessage());
            return false;
        }
    }

    public function existeMarca($id) {
        try {
            $sql = "SELECT COUNT(*) as count FROM marcas WHERE marca_id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            
            return $row['count'] > 0;
        } catch (Exception $e) {
            error_log("Error en existeMarca: " . $e->getMessage());
            return false;
        }
    }

    public function existeEstadoElemento($id) {
        try {
            $sql = "SELECT COUNT(*) as count FROM estados_elementos WHERE estado_elemento_id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            
            return $row['count'] > 0;
        } catch (Exception $e) {
            error_log("Error en existeEstadoElemento: " . $e->getMessage());
            return false;
        }
    }

    public function insertarElemento($datos) {
        try {
            $sql = "INSERT INTO elementos (
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
                estado_elemento_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            $stmt = $this->conn->prepare($sql);
            
            // Preparar los parámetros
            $categoria_id = !empty($datos['categoria_id']) ? intval($datos['categoria_id']) : null;
            $area_id = !empty($datos['area_id']) ? intval($datos['area_id']) : null;
            $marca_id = !empty($datos['marca_id']) ? intval($datos['marca_id']) : null;
            $estado_elemento_id = !empty($datos['estado_elemento_id']) ? intval($datos['estado_elemento_id']) : null;
            $elemento_cantidad = !empty($datos['elemento_cantidad']) ? intval($datos['elemento_cantidad']) : 0;
            $stmt->bind_param(
                'sssiissisisi',
                $datos['elemento_codigo'],          
                $datos['elemento_nombre'],         
                $datos['elemento_tipo'],         
                $categoria_id,                    
                $area_id,                        
                $datos['elemento_placa'],          
                $datos['elemento_serial'],         
                $marca_id,                          
                $datos['elemento_modelo'],        
                $elemento_cantidad,                 
                $datos['elemento_und_medida'],      
                $estado_elemento_id               
            );

            $result = $stmt->execute();
            
            if (!$result) {
                throw new Exception("Error al insertar elemento: " . $stmt->error);
            }

            return true;

        } catch (Exception $e) {
            error_log("Error en insertarElemento: " . $e->getMessage());
            throw $e;
        }
    }

    public function obtenerElementos($filtros = []) {
        try {
            $sql = "SELECT 
                e.*,
                c.nombre as categoria_nombre,
                a.nombre as area_nombre,
                m.nombre as marca_nombre,
                ee.nombre as estado_nombre
            FROM elementos e
            LEFT JOIN categorias c ON e.categoria_id = c.id
            LEFT JOIN areas a ON e.area_id = a.id
            LEFT JOIN marcas m ON e.marca_id = m.id
            LEFT JOIN estados_elementos ee ON e.estado_elemento_id = ee.id
            WHERE 1=1";

            $params = [];
            $types = '';

            // Aplicar filtros
            if (!empty($filtros['codigo'])) {
                $sql .= " AND e.elemento_codigo LIKE ?";
                $params[] = '%' . $filtros['codigo'] . '%';
                $types .= 's';
            }

            if (!empty($filtros['nombre'])) {
                $sql .= " AND e.elemento_nombre LIKE ?";
                $params[] = '%' . $filtros['nombre'] . '%';
                $types .= 's';
            }

            if (!empty($filtros['categoria_id'])) {
                $sql .= " AND e.categoria_id = ?";
                $params[] = $filtros['categoria_id'];
                $types .= 'i';
            }

            if (!empty($filtros['area_id'])) {
                $sql .= " AND e.area_id = ?";
                $params[] = $filtros['area_id'];
                $types .= 'i';
            }

            $sql .= " ORDER BY e.elemento_codigo";

            $stmt = $this->conn->prepare($sql);
            
            if (!empty($params)) {
                $stmt->bind_param($types, ...$params);
            }

            $stmt->execute();
            $result = $stmt->get_result();
            
            $elementos = [];
            while ($row = $result->fetch_assoc()) {
                $elementos[] = $row;
            }

            return $elementos;

        } catch (Exception $e) {
            error_log("Error en obtenerElementos: " . $e->getMessage());
            return [];
        }
    }

    public function obtenerElementoPorCodigo($codigo) {
        try {
            $sql = "SELECT * FROM elementos WHERE elemento_codigo = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param('s', $codigo);
            $stmt->execute();
            $result = $stmt->get_result();
            
            return $result->fetch_assoc();

        } catch (Exception $e) {
            error_log("Error en obtenerElementoPorCodigo: " . $e->getMessage());
            return null;
        }
    }

    public function actualizarElemento($codigo, $datos) {
        try {
            $sql = "UPDATE elementos SET 
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
                estado_elemento_id = ?,
                updated_at = NOW()
            WHERE elemento_codigo = ?";

            $stmt = $this->conn->prepare($sql);
            
            // Preparar los parámetros
            $categoria_id = !empty($datos['categoria_id']) ? intval($datos['categoria_id']) : null;
            $area_id = !empty($datos['area_id']) ? intval($datos['area_id']) : null;
            $marca_id = !empty($datos['marca_id']) ? intval($datos['marca_id']) : null;
            $estado_elemento_id = !empty($datos['estado_elemento_id']) ? intval($datos['estado_elemento_id']) : null;
            $elemento_cantidad = !empty($datos['elemento_cantidad']) ? floatval($datos['elemento_cantidad']) : 0;

            $stmt->bind_param(
                'ssiissisdis',
                $datos['elemento_nombre'],
                $datos['elemento_tipo'],
                $categoria_id,
                $area_id,
                $datos['elemento_placa'],
                $datos['elemento_serial'],
                $marca_id,
                $datos['elemento_modelo'],
                $elemento_cantidad,
                $datos['elemento_und_medida'],
                $estado_elemento_id,
                $codigo
            );

            $result = $stmt->execute();
            
            if (!$result) {
                throw new Exception("Error al actualizar elemento: " . $stmt->error);
            }

            return true;

        } catch (Exception $e) {
            error_log("Error en actualizarElemento: " . $e->getMessage());
            throw $e;
        }
    }

    public function eliminarElemento($codigo) {
        try {
            $sql = "DELETE FROM elementos WHERE elemento_codigo = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param('s', $codigo);
            $result = $stmt->execute();
            
            if (!$result) {
                throw new Exception("Error al eliminar elemento: " . $stmt->error);
            }

            return true;

        } catch (Exception $e) {
            error_log("Error en eliminarElemento: " . $e->getMessage());
            throw $e;
        }
    }

    public function __destruct() {
        if ($this->db) {
            $this->db->closeConnection();
        }
    }
}