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
    if (empty($nombre) || empty($permisos_ids)) return ["error" => "campos vacios"];

    $verificar_rol = $this->rol_modelo->obtenerRolPorNombre($nombre);
    if ($verificar_rol) return ["error" => "ya existe"];

    $guardar_rol = $this->rol_modelo->guardarRol($nombre, $permisos_ids);
    if ($guardar_rol) return ["success" => true];

    return ["error" => "error al guardar"];
  }

  public function obtenerTodosLosRoles()
  {
    $todos_los_roles = $this->rol_modelo->obtenerTodosLosRoles();

    if ($todos_los_roles) return $todos_los_roles;

    return ["error" => "error al obtener"];
  }

  public function obtenerRolPorId($id)
  {
    if (empty($id)) return ["error" => "campos vacios"];

    $rol = $this->rol_modelo->obtenerRolPorId($id);

    if ($rol) return $rol;

    return ["error" => "no existe"];
  }

  public function obtenerRolPorNombre($nombre)
  {
    if (empty($nombre)) return ["error" => "campos vacios"];

    $rol = $this->rol_modelo->obtenerRolPorNombre($nombre);

    if ($rol) return $rol;

    return ["error" => "error al obtener por nombre"];
  }

  public function editarRol($id, $nombre, $permisos_ids = [])
  {
    if (empty($id) || empty($nombre) || empty($permisos_ids)) return ["error" => "campos vacios"];

    $verificar_rol = $this->rol_modelo->obtenerRolPorId($id);
    if (!$verificar_rol) return ["error" => "no existe"];

    $guardar_rol = $this->rol_modelo->editarRol($id, $nombre, $permisos_ids);
    if ($guardar_rol) return ["success" => true];

    return ["error" => "error al guardar rol"];
  }

  public function desactivarRol($id)
  {
    if (empty($id)) return ["error" => "campos vacios"];

    $verificar_rol = $this->rol_modelo->obtenerRolPorId($id);
    if (!$verificar_rol) return ["error" => "no existe"];

    $desactivar_rol = $this->rol_modelo->desactivarRol($id);

    if ($desactivar_rol) return ["success" => true];

    return ["error" => "error al desactivar"];
  }
}
