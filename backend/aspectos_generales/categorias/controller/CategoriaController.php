<?php
require_once '../model/categoria.php';

class CategoriaController
{
  private $categoria_modelo;

  public function __construct($db)
  {
    $this->categoria_modelo = new CategoriaModel($db);
  }

  public function guardarCategoria($nombre, $tipo)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($nombre)) return ["error" => "no nombre"];
    if (empty($tipo)) return ["error" => "no tipo"];

    // Validar que no exista un area con el mismo ID en la base de datos antes de crear uno nuevo
    $verificar_categoria = $this->categoria_modelo->obtenerCategoriaPorNombre($nombre);
    if ($verificar_categoria) return ["error" => "ya existe categoria"];

    // Crear la desde el modelo y recibe mensajes de exito o error
    $resultado = $this->categoria_modelo->guardarCategoria($nombre, $tipo);
    if ($resultado) return $resultado;

    return ["error" => "error al guardar categoria"];
  }

  public function obtenerTodasLasCategorias()
  {
    // Obtiene todos las categorias desde el modelo y recibe mensajes de exito o error
    $resultado = $this->categoria_modelo->obtenerTodasLasCategorias();
    if ($resultado) return $resultado;

    return ["error" => "error al obtener categorias"];
  }

  public function obtenerCategoriaPorId($id)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($id)) return ["error" => "campos vacios categoria"];

    // Obtiene la categoria desde el modelo y recibe mensajes de exito o error
    $resultado = $this->categoria_modelo->obtenerCategoriaPorId($id);
    if ($resultado) return $resultado;

    return ["error" => "error al obtener categoria"];
  }

  public function obtenerCategoriaPorNombre($nombre)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($nombre)) return ["error" => "campos vacios categoria"];

    // Obtiene la categoria desde el modelo y recibe mensajes de exito o error
    $resultado = $this->categoria_modelo->obtenerCategoriaPorNombre($nombre);
    if ($resultado) return $resultado;

    return ["error" => "error al obtener categoria"];
  }

  public function editarCategoria($id, $nombre)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($id) || empty($nombre)) return ["error" => "campos vacios"];

    // Validar que la categoria a editar exista el la base de datos antes de intentar editarlo
    $verificar_categoria = $this->categoria_modelo->obtenerCategoriaPorId($id);
    if (!$verificar_categoria) return ["error" => "no existe categoria"];

    // Editar la categoria desde el modelo y recibir mensajes de exito o error
    $resultado = $this->categoria_modelo->editarCategoria($id, $nombre);
    if ($resultado) return $resultado;

    return ["error" => "error al editar categoria"];
  }

  public function desactivarCategoria($id)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($id)) return ["error" => "campos vacios categoria"];

    // Validar que la categoria a desactivar exista el la base de datos antes de intentar desactivarla
    $verificar_categoria = $this->categoria_modelo->obtenerCategoriaPorId($id);
    if (!$verificar_categoria) return ["error" => "no existe categoria"];

    // Desactivar la categoria desde el modelo y recibir mensajes de exito o error
    $resultado = $this->categoria_modelo->desactivarCategoria($id);
    if ($resultado) return $resultado;

    return ["error" => "error al desactivar categoria"];
  }
}
