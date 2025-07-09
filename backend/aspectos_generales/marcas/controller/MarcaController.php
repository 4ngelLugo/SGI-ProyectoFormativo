<?php
require_once '../model/Marca.php';

class MarcaController
{
  private $marca_modelo;

  public function __construct($db)
  {
    $this->marca_modelo = new MarcaModel($db);
  }

  public function guardarMarca($nombre)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($nombre)) return ["error" => "no nombre"];

    // Validar que no exista una marca con el mismo ID en la base de datos antes de crear uno nuevo
    $verificar_marca = $this->marca_modelo->obtenerMarcaPorNombre($nombre);
    if ($verificar_marca) return ["error" => "ya existe marca"];

    // Crear la marca desde el modelo y recibe mensajes de exito o error
    $resultado = $this->marca_modelo->guardarMarca($nombre);
    if ($resultado) return $resultado;

    return ["error" => "error al guardar marca"];
  }

  public function obtenerTodasLasMarcas()
  {
    // Obtiene todas las marcas desde el modelo y recibe mensajes de exito o error
    $resultado = $this->marca_modelo->obtenerTodasLasMarcas();
    if ($resultado) return $resultado;

    return ["error" => "error al obtener marcas"];
  }

  public function obtenerMarcaPorId($id)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($id)) return ["error" => "campos vacios marca"];

    // Obtiene la marca desde el modelo y recibe mensajes de exito o error
    $resultado = $this->marca_modelo->obtenerMarcaPorId($id);
    if ($resultado) return $resultado;

    return ["error" => "error al obtener marca"];
  }

  public function obtenerMarcaPorNombre($nombre)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($nombre)) return ["error" => "campos vacios marca"];

    // Obtiene la marca desde el modelo y recibe mensajes de exito o error
    $resultado = $this->marca_modelo->obtenerMarcaPorNombre($nombre);
    if ($resultado) return $resultado;

    return ["error" => "error al obtener marca"];
  }

  public function editarMarca($id, $nombre)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($id) || empty($nombre)) return ["error" => "campos vacios"];

    // Validar que la marca a editar exista el la base de datos antes de intentar editarla
    $verificar_marca = $this->marca_modelo->obtenerMarcaPorId($id);
    if (!$verificar_marca) return ["error" => "no existe marca"];

    // Editar la marca desde el modelo y recibir mensajes de exito o error
    $resultado = $this->marca_modelo->editarMarca($id, $nombre);
    if ($resultado) return $resultado;

    return ["error" => "error al editar marca"];
  }

  public function desactivarMarca($id)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($id)) return ["error" => "campos vacios marca"];

    // Validar que la marca a desactivar exista el la base de datos antes de intentar desactivarla
    $verificar_marca = $this->marca_modelo->obtenerMarcaPorId($id);
    if (!$verificar_marca) return ["error" => "no existe marca"];

    // Desactivar la marca desde el modelo y recibir mensajes de exito o error
    $resultado = $this->marca_modelo->desactivarMarca($id);
    if ($resultado) return $resultado;

    return ["error" => "error al desactivar marca"];
  }
}
