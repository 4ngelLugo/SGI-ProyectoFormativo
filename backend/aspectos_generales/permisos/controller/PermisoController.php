<?php
require_once '../model/Permiso.php';

class PermisoController
{
  private $permiso_modelo;

  public function __construct($db)
  {
    $this->permiso_modelo = new Permiso($db);
  }
  public function obtenerTodosLosPermisos()
  {
    // Obtiene todas los permisos desde el modelo y recibe mensajes de exito o error
    $resultado = $this->permiso_modelo->obtenerTodosLosPermisos();
    if ($resultado) return $resultado;

    return ["error" => "error al obtener permisos"];
  }

  public function obterPermisosPorRol(int $rol_id)
  {
    if (empty($rol_id)) return ["error" => "campos vacios"];

    $resultado = $this->permiso_modelo->obterPermisosPorRol($rol_id);
    if ($resultado) return $resultado;

    return ["error" =>  "error al obtener permisos"];
  }
}
