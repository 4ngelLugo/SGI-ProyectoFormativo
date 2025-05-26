

<?php

// POR MARLON REINA
// Actualice la clase Database con el siguiente contenido: 
// 1. Sanitice los datos de la conexión a la base de datos.
// 2. Maneje apropiadamente la creacion de la conexion directamente desde el constructor.
// 3. Agregue los metodos connect(), getConnection() y closeConnection().
// PENDIENTES:
// 1. Setters y getters para cada atributo de la conexion.
// 2. Servir el $host desde un archivo .env


class Database
{
  private $host = "localhost";
  private $user = "root";
  private $password = "";
  private $database = "sistema_prestamos";
  public $conn = null;

  public function __construct($username = null, $password = null) {
    if ($username !== null) {
      $this->user = $username;
    }
    if ($password !== null) {
      $this->password = $password;
    }

    try {
      $this->conn = new mysqli(
        $this->host,
        $this->user,
        $this->password,
        $this->database
      );

      if ($this->conn->connect_error) {
        throw new Exception("Connection failed: " . $this->conn->connect_error);
      }

      $this->conn->set_charset("utf8");
    } catch(Exception $e) {
      // Registrar error en archivo
      error_log("[" . date("Y-m-d H:i:s") . "] Connection error: " . $e->getMessage() . PHP_EOL, 3, __DIR__ . "/../logs/php_errors.log");
      die("Connection failed: " . $e->getMessage());
    }
  }

  public function connect() {
    return $this->conn;
  }

  public function getConnection() {
    return $this->conn;
  }

  public function executeQuery($sql, $params = []) {
    try {
      $stmt = $this->conn->prepare($sql);
      
      if ($params) {
        $types = str_repeat('s', count($params));
        $stmt->bind_param($types, ...$params);
      }
      
      $stmt->execute();
      return $stmt;
    } catch(Exception $e) {
      error_log("[" . date("Y-m-d H:i:s") . "] Query error: " . $e->getMessage() . PHP_EOL, 3, __DIR__ . "/../logs/php_errors.log");
      die("Query execution failed: " . $e->getMessage());
    }
  }

  public function closeConnection() {
    if ($this->conn) {
      $this->conn->close();
      $this->conn = null;
    }
  }
}
