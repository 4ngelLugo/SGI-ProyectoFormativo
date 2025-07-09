<?php
include_once '../model/Rol.php';

class RolController
{
  private $rol_modelo;

  public function __construct($db)
  {
    $this->rol_modelo = new Rol($db);
  }

  public function guardarRol($nombre, $permisos_ids = [])
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($nombre) || empty($permisos_ids)) return ["error" => "campos vacios"];

    // Validar que no exista un elemento con el mismo codigo en la base de datos antes de crear uno nuevo
    $verificar_rol = $this->rol_modelo->obtenerRolPorNombre($nombre);
    if (isset($verificar_rol['success'])) return ["error" => "ya existe rol"];

    $resultado = $this->rol_modelo->guardarRol($nombre, $permisos_ids);
    if ($resultado) return $resultado;

    return ["error" => "error al guardar rol"];
  }

  public function obtenerTodosLosRoles()
  {
    $resultado = $this->rol_modelo->obtenerTodosLosRoles();
    if ($resultado) return $resultado;

    return ["error" => "error al obtener roles"];
  }

  public function obtenerRolPorId($id)
  {
    if (empty($id)) return ["error" => "campos vacios rol"];

    $resultado = $this->rol_modelo->obtenerRolPorId($id);
    if ($resultado) return $resultado;

    return ["error" => "error al obtener rol"];
  }

  public function editarRol($id, $nombre, $permisos_ids = [])
  {
    if (empty($id) || empty($nombre) || empty($permisos_ids)) return ["error" => "campos vacios"];

    $verificar_rol = $this->rol_modelo->obtenerRolPorId($id);
    if (!$verificar_rol) return ["error" => "no existe rol"];

    $resultado = $this->rol_modelo->editarRol($id, $nombre, $permisos_ids);
    if ($resultado) return $resultado;

    return ["error" => "error al editar rol"];
  }

  public function desactivarRol($id)
  {
    if (empty($id)) return ["error" => "campos vacios"];

    $verificar_rol = $this->rol_modelo->obtenerRolPorId($id);
    if (!$verificar_rol) return ["error" => "no existe rol"];

    $resultado = $this->rol_modelo->desactivarRol($id);

    if ($resultado) return $resultado;

    return ["error" => "error al desactivar rol"];
  }
}
