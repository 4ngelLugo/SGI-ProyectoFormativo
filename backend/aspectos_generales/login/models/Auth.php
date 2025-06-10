<?php
 
// POR MARLON REINA

// Clase de conexion a la base de datos para la autenticacion de usuarios.

// PENDIENTE COMENTAR METODOS.

require_once '../../../config/Database.php';

class Auth {
    private $document;
    private $password;
    private $userData;
    private $connection;

    public function __construct(Int $document, String $password) {
        $this->document = $document;
        $this->password = $password;
        $this->connection = new Database();
    }

    public function authenticate() {
        $sql = "SELECT * FROM usuarios WHERE usuario_documento = ?";
        $stmt = $this->connection->executeQuery($sql, [$this->document]);
    
        if (!$stmt) {
            return false;
        }
    
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
    
        if (!$user) {
            return false;
        }
    
        if ($this->password === $user['usuario_contrasena']) {
            $this->userData = $user;
            return true;
        }
    
        file_put_contents('log.txt', "Password incorrecto\n", FILE_APPEND);
        return false;
    }
    
    
    public function getUserData() {
        return $this->userData;
    }
    
    public function getUserDbCredentials() {
        if ($this->userData) {
            return [
                'db_username' => $this->userData['usuario_documento'],
                'db_password' => $this->userData['usuario_contrasena']
            ];
        }
        return null;
    }
    
    private function hashPassword($password) {
        return password_hash($password, PASSWORD_DEFAULT);
    }
    
    public function closeConnection() {
        $this->connection->closeConnection();
    }
}
?>