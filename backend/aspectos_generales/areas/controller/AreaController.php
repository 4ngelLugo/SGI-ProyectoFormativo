<?php
include_once '../model/Area.php';

class AreaController
{
  private $area_modelo;

  public function __construct($db)
  {
    $this->area_modelo = new AreaModel($db);
  }

  public function guardarArea($nombre)
  {
    if (empty($nombre)) return ["error" => "campos vacios"];

    $verificar_area = $this->area_modelo->obtenerAreaPorNombre($nombre);
    if ($verificar_area) return ["error" => "ya existe"];

    $guardar_area = $this->area_modelo->guardarArea($nombre);
    if ($guardar_area) return ["success" => true];

    return ["error" => "error al guardar"];
  }

  public function obtenerTodasLasAreas()
  {
    $todas_las_areas = $this->area_modelo->obtenerTodasLasAreas();

    if ($todas_las_areas) return $todas_las_areas;

    return ["error" => "error al obtener"];
  }

  public function obtenerAreaPorId($id)
  {
    if (empty($id)) return ["error" => "campos vacios"];

    $area = $this->area_modelo->obtenerAreaPorId($id);

    if ($area) return $area;

    return ["error" => "error al obtener por id"];
  }

  public function obtenerAreaPorNombre($nombre)
  {
    if (empty($nombre)) return ["error" => "campos vacios"];

    $area = $this->area_modelo->obtenerAreaPorNombre($nombre);

    if ($area) return $area;

    return ["error" => "error al obtener por nombre"];
  }

  public function editarArea($id, $nombre)
  {
    if (empty($id) || empty($nombre)) return ["error" => "campos vacios"];

    $verificar_area = $this->area_modelo->obtenerAreaPorId($id);
    if (!$verificar_area) return ["error" => "no existe"];

    $editar_area = $this->area_modelo->editarArea($id, $nombre);
    if ($editar_area) return ["success" => true];

    return ["error" => "error al editar"];
  }

  public function desactivarArea($id)
  {
    if (empty($id)) return ["error" => "campos vacios"];

    $verificar_area = $this->area_modelo->obtenerAreaPorId($id);
    if (!$verificar_area) return ["error" => "no existe"];

    $desactivar_area = $this->area_modelo->desactivarArea($id);
    if ($desactivar_area) return ["success" => true];

    return ["error" => "error al area"];
  }
}
