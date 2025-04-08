<!-- 
POR MARLON REINA

Clase de conexion a la base de datos para la autenticacion de usuarios.

PENDIENTE COMENTAR METODOS.
-->
<?php
require_once '../../config/Database.php';

class Auth {
    private $document;
    private $password;
    private $userData;
    private $connection;

    public function __construct($document, $password) {
        $this->document = $document;
        $this->password = $password;
        $this->connection = new Database();
    }

    public function authenticate() {
        $sql = "SELECT * FROM usuario WHERE Numero_Documento = ?";
        $stmt = $this->connection->executeQuery($sql, [$this->document]);
        $user = $stmt->fetch();
        
        if (!$user) {
            return false;
        }
        
        if ($this->password === $user['Contrasena']) {
            $this->userData = $user;
            return true;
        }
        
        return false;
    }
    
    public function getUserData() {
        return $this->userData;
    }
    
    public function getUserDbCredentials() {
        if ($this->userData) {
            return [
                'db_username' => $this->userData['Numero_Documento'],
                'db_password' => $this->userData['Contrasena']
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