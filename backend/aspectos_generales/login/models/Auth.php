<?php
require_once '../../../usuarios/Model/Usuario.php';

class Auth
{
  private $userData;
  private $usuario_modelo;
  private $conn;
  private $error_return = "";

  public function __construct($db)
  {
    $this->conn = $db;
    $this->usuario_modelo = new UsuarioModel($db);
  }

  public function autenticar(int $documento, string $contrasena)
  {
    try {
      $usuario = $this->usuario_modelo->obtenerUsuarioPorDocumento($documento);

      if (isset($usuario["error"])) {
        $this->error_return = "error al obtener usuario";
        throw new Exception("Execute failed (Obtener usuario)");
      }

      if (!$usuario) {
        $this->error_return = "error al obtener usuario";
        throw new Exception("Execute failed (Obtener usuario)");
      }

      if ($usuario['estado'] != "activo") {
        $this->error_return = "usuario inactivo";
        throw new Exception("Execute failed (Usuario inactivo)");
      }

      if (!password_verify($contrasena, $usuario['contrasena'])) {
        $this->error_return = "contrasena incorrecta";
        throw new Exception("Execute failed (Contraseña incorrecta)");
      }

      $this->userData = $usuario;
      return ["success" => true];
    } catch (Exception $e) {
      $this->logError($e->getMessage());

      return !empty($this->error_return) ? ["error" => $this->error_return] : [];
    }
  }

  public function obtenerUsuario()
  {
    return $this->userData;
  }

  private function logError($message)
  {
    error_log("[" . date("Y-m-d H:i:s") . "] $message" . PHP_EOL, 3, __DIR__ . "/../../../logs/php_errors.log");
  }
}
