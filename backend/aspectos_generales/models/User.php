<!-- 
POR MARLON REINA

Clase de Usuarios.

PENDIENTE COMENTAR METODOS.
-->
<?php
require_once '../../config/Database.php';

class User {
    private $userData;
    private $connection;
    
    public function __construct($userData) {
        $this->userData = $userData;
        
        // Create a connection with user-specific database credentials
        if (isset($userData['db_username']) && isset($userData['db_password'])) {
            $this->connection = new Database(
                $userData['db_username'],
                $userData['db_password']
            );
        } else {
            throw new Exception("User database credentials not provided");
        }
    }
    
    public function getUserInfo() {
        return $this->userData;
    }
    
    
    public function closeConnection() {
        $this->connection->closeConnection();
    }
}
?>