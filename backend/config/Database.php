<!--
POR MARLON REINA

Actualice la clase Database con el siguiente contenido: 

1. Sanitice los datos de la conexión a la base de datos.

2. Maneje apropiadamente la creacion de la conexion directamente desde el constructor.

3. Agregue los metodos connect(), getConnection() y closeConnection().

PENDIENTES:
1. Setters y getters para cada atributo de la conexion.

2. Servir el $host desde un archivo .env
-->

<?php
class Database
{
  private $host = "localhost";
  private $user = "root";
  private $password = "";
  private $database = "sgisena";
  public $conn = null;

  public function __construct($username = null, $password = null) {
    if ($username !== null) {
      $this->user = $username;
    }
    if ($password !== null) {
      $this->password = $password;
    }

    try {
      $this->conn = new PDO(
        "mysql:host=$this->host;dbname=$this->database;charset=utf8",
        $this->user,
        $this->password
      );
      $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
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
      $stmt->execute($params);
      return $stmt;
    } catch(PDOException $e) {
      error_log("[" . date("Y-m-d H:i:s") . "] Query error: " . $e->getMessage() . PHP_EOL, 3, __DIR__ . "/../logs/php_errors.log");
      die("Query execution failed: " . $e->getMessage());
    }
  }

  public function closeConnection() {
    $this->conn = null;
  }
}
