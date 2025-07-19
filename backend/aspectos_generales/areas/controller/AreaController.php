<?php
require_once '../model/Area.php';

class AreaController
{
  private $area_modelo;

  public function __construct($db)
  {
    $this->area_modelo = new AreaModel($db);
  }

  public function guardarArea($nombre)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($nombre)) return ["error" => "no nombre"];

    // Validar que no exista un area con el mismo nombre en la base de datos antes de crear uno nuevo
    $verificar_area = $this->area_modelo->obtenerAreaPorNombre($nombre);
    if ($verificar_area) return ["error" => "ya existe area"];

    // Crear el area desde el modelo y recibe mensajes de exito o error
    $resultado = $this->area_modelo->guardarArea($nombre);
    if ($resultado) return $resultado;

    return ["error" => "error al guardar area"];
  }

  public function obtenerTodasLasAreas()
  {
    // Obtiene todas las areas desde el modelo y recibe mensajes de exito o error
    $resultado = $this->area_modelo->obtenerTodasLasAreas();
    if ($resultado) return $resultado;

    return ["error" => "error al obtener areas"];
  }

  public function obtenerAreaPorId($id)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($id)) return ["error" => "campos vacios area"];

    // Obtiene el area desde el modelo y recibe mensajes de exito o error
    $resultado = $this->area_modelo->obtenerAreaPorId($id);
    if ($resultado) return $resultado;

    return ["error" => "error al obtener area"];
  }

  public function obtenerAreaPorNombre($nombre)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($nombre)) return ["error" => "campos vacios area"];

    // Obtiene el area desde el modelo y recibe mensajes de exito o error
    $resultado = $this->area_modelo->obtenerAreaPorNombre($nombre);
    if ($resultado) return $resultado;

    return ["error" => "error al obtener area"];
  }

  public function editarArea($id, $nombre)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($id) || empty($nombre)) return ["error" => "campos vacios"];

    // Validar que el area a editar exista el la base de datos antes de intentar editarla
    $verificar_area = $this->area_modelo->obtenerAreaPorId($id);
    if (!$verificar_area) return ["error" => "no existe area"];

    // Editar el area desde el modelo y recibir mensajes de exito o error
    $resultado = $this->area_modelo->editarArea($id, $nombre);
    if ($resultado) return $resultado;

    return ["error" => "error al editar area"];
  }

  public function desactivarArea($id)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($id)) return ["error" => "campos vacios area"];

    // Validar que el area a desactivar exista en la base de datos antes de intentar desactivarla
    $verificar_area = $this->area_modelo->obtenerAreaPorId($id);
    if (!$verificar_area) return ["error" => "no existe area"];

    // Desactivar el area desde el modelo y recibir mensajes de exito o error
    $resultado = $this->area_modelo->desactivarArea($id);
    if ($resultado) return $resultado;

    return ["error" => "error al desactivar area"];
  }
}
