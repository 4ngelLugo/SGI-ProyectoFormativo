<?php
require_once '../models/Auth.php';

class AuthController
{
  private $auth_modelo;

  public function __construct($db)
  {
    $this->auth_modelo = new Auth($db);
  }

  public function autenticar(int $documento, string $contrasena)
  {
    if (empty($documento) || empty($contrasena)) return ["error" => "campos vacios"];

    $resultado = $this->auth_modelo->autenticar($documento, $contrasena);
    if ($resultado) return $resultado;

    return ["error" => "error al autenticar"];
  }

  public function obtenerUsuario() {
    $resultado = $this->auth_modelo->obtenerUsuario();
    if ($resultado) return $resultado;

    return ["error" => "error al obtener usuario"];
  }
}
