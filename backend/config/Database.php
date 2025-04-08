<?php
class Database
{
  private $host = "localhost";
  private $user = "root";
  private $password = "";
  private $database = "sistema_prestamos";
  public $conn = null;

  public function connect()
  {
    if ($this->conn == null) {
      mysqli_report(MYSQLI_REPORT_OFF);

      $this->conn = @mysqli_connect($this->host, $this->user, $this->password, $this->database);

      if (!$this->conn) {
        // Registrar error en archivo
        error_log("[" . date("Y-m-d H:i:s") . "] Connection error: " . mysqli_connect_error() . PHP_EOL, 3, __DIR__ . "/../logs/php_errors.log");

        return null;
      }
    }

    return $this->conn;
  }
}
