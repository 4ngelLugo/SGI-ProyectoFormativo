<?php
include '../Model/Usuario.php';
class UsuarioController
{
  private $usuario_modelo;

  public function __construct($db)
  {
    $this->usuario_modelo = new UsuarioModel($db);
  }

  public function guardarUsuario(array $datos)
  {
    // Validar que los campos requeridos no esten vacios
    if (
      empty($datos['documento'])
      || empty($datos['tipo_documento'])
      || empty($datos['nombres'])
      || empty($datos['apellidos'])
      || empty($datos['telefono'])
      || empty($datos['correo'])
      || empty($datos['contrasena'])
      || empty($datos['confirmar'])
      || empty($datos['rol'])
    ) return ["error" => "campos vacios"];

    // Valida que el correo sea valido según el filtro de PHP
    if (!filter_var($datos['correo'], FILTER_VALIDATE_EMAIL)) return ["error" => "correo no valido"];

    // Asegura que el usuario confirme la contraseña de manera correcta
    if ($datos['contrasena'] !== $datos['confirmar']) return ["error" => "contrasenas no coinciden"];

    // Validar que no exista un usuario con el mismo documento en la base de datos antes de crear uno nuevo
    $validar_usuario = $this->usuario_modelo->obtenerUsuarioPorDocumento($datos['documento']);
    if (isset($validar_usuario['documento'])) return ["error" => "ya existe usuario"];

    // Validar que no exista un usuario con el mismo correo en la base de datos antes de crear uno nuevo
    $validar_usuari_correo = $this->usuario_modelo->obtenerUsuarioPorCorreo($datos['correo']);
    if (isset($validar_usuari_correo['documento'])) return ["error" => "ya existe correo"];

    // Encripta la contraseña para almacenarla de forma segura, y remplaza el campo de contraseña en el array de datos
    $hashed_password = password_hash($datos['contrasena'], PASSWORD_DEFAULT);
    $datos['contrasena'] = $hashed_password;

    // Crear el usuario desde el modelo y recibe mensajes de exito o error
    $resultado = $this->usuario_modelo->guardarUsuario($datos);
    if ($resultado) return $resultado;

    return ["error" => "error al guardar usuario"];
  }

  public function obtenerTodosLosUsuarios()
  {
    // Obtiene todos los usuarios desde el modelo y recibe mensajes de exito o error
    $resultado = $this->usuario_modelo->obtenerTodosLosUsuarios();
    if ($resultado) return $resultado;

    return ["error" => "error al obtener usuarios"];
  }

  public function obtenerUsuarioPorDocumento(int $documento)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($documento)) return ["error" => "campos vacios usuario"];

    // Obtiene el usuario desde el modelo y recibe mensajes de exito o error
    $resultado = $this->usuario_modelo->obtenerUsuarioPorDocumento($documento);
    if ($resultado) return $resultado;

    return ["error" => "error al obtener usuario"];
  }

  public function editarUsuario(array $datos)
  {
    // Validar que los campos requeridos no esten vacios
    if (
      empty($datos['documento'])
      || empty($datos['tipo_documento'])
      || empty($datos['nombres'])
      || empty($datos['apellidos'])
      || empty($datos['telefono'])
      || empty($datos['correo'])
    ) return ["error" => "campos vacios"];

    // Valida que el correo sea valido según el filtro de PHP
    if (!filter_var($datos['correo'], FILTER_VALIDATE_EMAIL)) return ["error" => "correo no valido"];

    // Validar que el usuario a editar exista el la base de datos antes de intentar editarlo
    $validar_usuario = $this->usuario_modelo->obtenerUsuarioPorDocumento($datos['documento']);
    if (!$validar_usuario) return ["error" => "no existe usuario"];

    // Editar el usuario desde el modelo y recibir mensajes de exito o error
    $resultado = $this->usuario_modelo->editarUsuario($datos);
    if ($resultado) return $resultado;

    return ["error" => "error al editar usuario"];
  }

  public function desactivarUsuario(int $documento)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($documento)) return ["error" => "campos vacios"];

    // Validar que el usuario a editar exista el la base de datos antes de intentar editarlo
    $validar_usuario = $this->usuario_modelo->obtenerUsuarioPorDocumento($documento);
    if (!$validar_usuario) return ["error" => "no existe usuario"];

    // Deshabilitar el usuario desde el modelo y recibir mensajes de exito o error
    $resultado = $this->usuario_modelo->desactivarUsuario($documento);
    if ($resultado) return $resultado;

    return ["error" => "error al desactivar usuario"];
  }

  // PARA HACER
  public function cambiarContraseña()
  {
    return null;
  }
}
