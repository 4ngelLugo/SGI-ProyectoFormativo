<?php

class Bitacora
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function getBitacora()
    {
        $sql = "SELECT * FROM bitacora";
        $result = $this->conn->query($sql);

        if ($result->num_rows > 0) {
            $bitacora = array();
            while ($row = $result->fetch_assoc()) {
                $bitacora[] = $row;
            }
        }
    }

    public function addBitacora($tabla, $accion, $query)
    {
        $UUID = $this->generateUUID();
        $usuario = $_SESSION['document'];
        $descripcion = $this->generateDescription($tabla, $accion, $query);
        $sql = "INSERT INTO bitacora (UUID, usuario, tabla, accion, descripcion, query) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssssss", $UUID, $usuario, $tabla, $accion, $descripcion, $query);
        $stmt->execute();
    }

    public function generateUUID()
    {
        $uuid = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );

        return $uuid;
    }

    public function generateDescription($tabla, $accion, $query)
    {
        $descripcion = "";
        
        switch (strtoupper($accion)) {
            case 'INSERT':
                $valores = $this->extraerValoresInsert($query);
                $descripcion = "Se insertó en la tabla $tabla los siguientes datos: $valores";
                break;
                
            case 'UPDATE':
                $id = $this->extraerIdUpdate($query);
                $cambios = $this->extraerCambiosUpdate($query);
                $descripcion = "Se actualizó en la tabla $tabla el registro ID: $id. Campos modificados: $cambios";
                break;
                
            case 'DELETE':
                $condiciones = $this->extraerCondicionesDelete($query);
                $descripcion = "Se eliminó de la tabla $tabla el registro con: $condiciones";
                break;
                
            default:
                $descripcion = "Se realizó la acción $accion en la tabla $tabla";
        }
        
        return $descripcion;
    }
    
    private function extraerValoresInsert($query)
    {
        preg_match('/\((.*?)\)\s+VALUES\s+\((.*?)\)/i', $query, $matches);
        if (isset($matches[1]) && isset($matches[2])) {
            $columnas = array_map('trim', explode(',', $matches[1]));
            $valores = array_map('trim', explode(',', $matches[2]));
            $pares = [];
            foreach ($columnas as $index => $columna) {
                $pares[] = trim($columna, '`') . " = " . $valores[$index];
            }
            return implode(', ', $pares);
        }
        return '';
    }
    
    private function extraerIdUpdate($query)
    {
        preg_match('/WHERE\s+.*?(\d+)/i', $query, $matches);
        return isset($matches[1]) ? $matches[1] : 'desconocido';
    }
    
    private function extraerCambiosUpdate($query)
    {
        preg_match('/SET\s+(.*?)\s+WHERE/i', $query, $matches);
        return isset($matches[1]) ? $matches[1] : '';
    }
    
    private function extraerCondicionesDelete($query)
    {
        preg_match('/WHERE\s+(.*?)$/i', $query, $matches);
        return isset($matches[1]) ? $matches[1] : '';
    }
}

?>