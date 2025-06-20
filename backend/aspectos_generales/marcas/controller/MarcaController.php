<?php
include_once '../model/Marca.php';

class MarcaController
{
  private $marca_modelo;

  public function __construct($db)
  {
    $this->marca_modelo = new MarcaModel($db);
  }

  public function guardarMarca($nombre)
  {
    if (empty($nombre)) return ["error" => "campos vacios"];

    $verificar_marca = $this->marca_modelo->obtenerMarcaPorNombre($nombre);
    if ($verificar_marca) return ["error" => "ya existe"];

    $guardar_marca = $this->marca_modelo->guardarMarca($nombre);
    if ($guardar_marca) return ["success" => true];

    return ["error" => "error al guardar"];
  }

  public function obtenerTodasLasMarcas()
  {
    $todas_las_marcas = $this->marca_modelo->obtenerTodasLasMarcas();

    if ($todas_las_marcas) return $todas_las_marcas;

    return ["error" => "error al obtener"];
  }

  public function obtenerMarcaPorId($id)
  {
    if (empty($id)) return ["error" => "campos vacios"];

    $marca = $this->marca_modelo->obtenerMarcaPorId($id);

    if ($marca) return $marca;

    return ["error" => "error al obtener por id"];
  }

  public function obtenerMarcaPorNombre($nombre)
  {
    if (empty($nombre)) return ["error" => "campos vacios"];

    $marca = $this->marca_modelo->obtenerMarcaPorNombre($nombre);

    if ($marca) return $marca;

    return ["error" => "error al obtener por nombre"];
  }

  public function editarMarca($id, $nombre)
  {
    if (empty($id) || empty($nombre)) return ["error" => "campos vacios"];

    $verificar_marca = $this->marca_modelo->obtenerMarcaPorId($id);
    if (!$verificar_marca) return ["error" => "no existe"];

    $editar_marca = $this->marca_modelo->editarMarca($id, $nombre);
    if ($editar_marca) return ["success" => true];

    return ["error" => "error al editar"];
  }

  public function desactivarMarca($id)
  {
    if (empty($id)) return ["error" => "campos vacios"];

    $verificar_marca = $this->marca_modelo->obtenerMarcaPorId($id);
    if (!$verificar_marca) return ["error" => "no existe"];

    $desactivar_marca = $this->marca_modelo->desactivarMarca($id);
    if ($desactivar_marca) return ["success" => true];

    return ["error" => "error al desactivar"];
  }
}
