<?php
include '../Model/Usuario.php';
class UsuarioController
{
  private $usuario_modelo;

  public function __construct($db)
  {
    $this->usuario_modelo = new UsuarioModel($db);
  }

  public function guardarUsuario($documento, $tipo_documento, $nombres, $apellidos, $telefono, $correo, $contrasena, $confirmar, $rol)
  {
    if (
      empty($documento)
      || empty($tipo_documento)
      || empty($nombres)
      || empty($apellidos)
      || empty($telefono)
      || empty($correo)
      || empty($contrasena)
      || empty($confirmar)
      || empty($rol)
    ) return ["error" => "campos vacios"];

    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) return ["error" => "correo no valido"];

    if ($contrasena !== $confirmar) return ["error" => "contrasenas no coinciden"];

    $validar_usuario = $this->usuario_modelo->obtenerUsuarioPorDocumento($documento);
    if ($validar_usuario) return ["error" => "ya existe"];

    $hashed_password = password_hash($contrasena, PASSWORD_DEFAULT);

    $result = $this->usuario_modelo->guardarUsuario($documento, $tipo_documento, $nombres, $apellidos, $telefono, $correo, $hashed_password, $rol);

    if ($result) return ['success' => true];

    return ["error" => "error al guardar"];
  }

  public function obtenerTodosLosUsuarios($estado = "activo")
  {
    $todos_los_usuarios = $this->usuario_modelo->obtenerTodosLosUsuarios($estado);

    if ($todos_los_usuarios) return $todos_los_usuarios;

    return ["error" => "error al obtener"];
  }

  public function obtenerUsuarioPorDocumento($documento)
  {
    if (empty($documento)) return ["error" => "campos vacios"];

    $usuario = $this->usuario_modelo->obtenerUsuarioPorDocumento($documento);

    if ($usuario) return $usuario;

    return ["error" => "no existe"];
  }

  public function editarUsuario($documento, $tipo_documento, $nombres, $apellidos, $telefono, $correo, $rol)
  {
    if (
      empty($documento)
      || empty($tipo_documento)
      || empty($nombres)
      || empty($apellidos)
      || empty($telefono)
      || empty($correo)
      || empty($rol)
    ) return ["error" => "campos vacios"];

    $validar_usuario = $this->usuario_modelo->obtenerUsuarioPorDocumento($documento);
    if (!$validar_usuario) return ["error" => "no existe"];

    $result = $this->usuario_modelo->editarUsuario($documento, $tipo_documento, $nombres, $apellidos, $telefono, $correo, $rol);
    if ($result) return ["success" => true];

    return ["error" => "error al actualizar"];
  }

  public function desactivarUsuario($documento)
  {
    if (empty($documento)) return ["error" => "campos vacios"];

    $validar_usuario = $this->usuario_modelo->obtenerUsuarioPorDocumento($documento);
    if (!$validar_usuario) return ["error" => "no existe"];

    $result = $this->usuario_modelo->desactivarUsuario($documento);

    if ($result) return ["success" => true];

    return ["error" => "error al desactivar"];
  }

  // PARA HACER
  public function cambiarContraseña()
  {
    return null;
  }
}
