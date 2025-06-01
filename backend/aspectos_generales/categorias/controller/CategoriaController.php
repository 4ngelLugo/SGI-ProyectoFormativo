<?php
include_once '../model/categoria.php';

class CategoriaController
{
  private $categoria_modelo;

  public function __construct($db)
  {
    $this->categoria_modelo = new CategoriaModel($db);
  }

  public function guardarCategoria($nombre)
  {
    if (empty($nombre)) return ["error" => "campos vacios"];

    $verificar_categoria = $this->categoria_modelo->obtenerCategoriaPorNombre($nombre);
    if ($verificar_categoria) return ["error" => "ya existe"];

    $guardar_categoria = $this->categoria_modelo->guardarCategoria($nombre);
    if ($guardar_categoria) return ["success" => true];

    return ["error" => "error al guardar"];
  }

  public function obtenerTodasLasCategorias()
  {
    $todas_las_categorias = $this->categoria_modelo->obtenerTodasLasCategorias();

    if ($todas_las_categorias) return $todas_las_categorias;

    return ["error" => "error al obtener"];
  }

  public function obtenerCategoriaPorId($id)
  {
    if (empty($id)) return ["error" => "campos vacios"];

    $categoria = $this->categoria_modelo->obtenerCategoriaPorId($id);

    if ($categoria) return $categoria;

    return ["error" => "error al obtener por id"];
  }

  public function obtenerCategoriaPorNombre($nombre)
  {
    if (empty($nombre)) return ["error" => "campos vacios"];

    $categoria = $this->categoria_modelo->obtenerCategoriaPorNombre($nombre);

    if ($categoria) return $categoria;

    return ["error" => "error al obtener por nombre"];
  }

  public function editarCategoria($id, $nombre)
  {
    if (empty($id) || empty($nombre)) return ["error" => "campos vacios"];

    $verificar_categoria = $this->categoria_modelo->obtenerCategoriaPorId($id);
    if (!$verificar_categoria) return ["error" => "no existe"];

    $editar_categoria = $this->categoria_modelo->editarCategoria($id, $nombre);
    if ($editar_categoria) return ["success" => true];

    return ["error" => "error al editar"];
  }

  public function desactivarCategoria($id)
  {
    if (empty($id)) return ["error" => "campos vacios"];

    $verificar_categoria = $this->categoria_modelo->obtenerCategoriaPorId($id);
    if (!$verificar_categoria) return ["error" => "no existe"];

    $desactivar_categoria = $this->categoria_modelo->desactivarCategoria($id);
    if ($desactivar_categoria) return ["success" => true];

    return ["error" => "error al desactivar"];
  }
}
