<?php
include_once '../model/Area.php';

class AreaController
{
  private $area_model;

  public function __construct($db)
  {
    $this->area_model = new AreaModel($db);
  }

  public function guardarArea($nombre)
  {
    if (empty($nombre)) return ["error" => "campos vacios"];

    $verificar_area = $this->area_model->obtenerAreaPorNombre($nombre);
    if ($verificar_area) return ["error" => "area ya existe"];

    $guardar_area = $this->area_model->guardarArea($nombre);
    if ($guardar_area) return ["success" => true];

    return ["error" => "error al guardar"];
  }

  public function obtenerTodasLasAreas()
  {
    $todas_las_areas = $this->area_model->obtenerTodasLasAreas();

    if ($todas_las_areas) return $todas_las_areas;

    return ["error" => "error al obtener areas"];
  }

  public function obtenerAreaPorId($id)
  {
    if (empty($id)) return ["error" => "campos vacios"];

    $area = $this->area_model->obtenerAreaPorId($id);

    if ($area) return $area;

    return ["error" => "error al obtener area por id"];
  }

  public function obtenerAreaPorNombre($nombre)
  {
    if (empty($nombre)) return ["error" => "campos vacios"];

    $area = $this->area_model->obtenerAreaPorNombre($nombre);

    if ($area) return $area;

    return ["error" => "error al obtener area por nombre"];
  }

  public function editarArea($id, $nombre)
  {
    if (empty($id) || empty($nombre)) return ["error" => "campos vacios"];

    $verificar_area = $this->area_model->obtenerAreaPorId($id);
    if (!$verificar_area) return ["error" => "area no existe"];

    $editar_area = $this->area_model->editarArea($id, $nombre);
    if ($editar_area) return ["success" => true];

    return ["error" => "error al editar area"];
  }

  public function desactivarArea($id)
  {
    if (empty($id)) return ["error" => "campos vacios"];

    $verificar_area = $this->area_model->obtenerAreaPorId($id);
    if (!$verificar_area) return ["error" => "area no existe"];

    $desactivar_area = $this->area_model->desactivarArea($id);
    if ($desactivar_area) return ["success" => true];

    return ["error" => "error al desactivar area"];
  }
}
