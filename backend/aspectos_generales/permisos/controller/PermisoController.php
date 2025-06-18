<?php
include '../model/Permiso.php';

class PermisoController
{
  private $permiso_modelo;

  public function __construct($db)
  {
    $this->permiso_modelo = new Permiso($db);
  }
  public function obtenerTodosLosPermisos()
  {
    $todos_los_permisos = $this->permiso_modelo->obtenerTodosLosPermisos();

    if ($todos_los_permisos) return $todos_los_permisos;

    return ["error" => "error al obtener permisos"];
  }
}
