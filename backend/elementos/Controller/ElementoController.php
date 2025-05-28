<?php
include '../Model/Elemento.php';

class ElementoController
{
  private $elemento_modelo;

  public function __construct($db)
  {
    $this->elemento_modelo = new Elemento($db);
  }

  public function guardarElemento($codigo, $nombre, $tipo, $categoria, $area, $placa = null, $serial = null, $marca = null, $modelo = null, $cantidad = null, $medida = null)
  {
    switch ($tipo) {
      case "devolutivo":
        if (
          empty($codigo)
          || empty($nombre)
          || empty($tipo)
          || empty($categoria)
          || empty($area)
          || empty($placa)
          || empty($serial)
          || empty($marca)
          || empty($modelo)
        ) return ["error" => "campos vacios"];
        break;

      case "consumible":
        if (
          empty($codigo)
          || empty($nombre)
          || empty($tipo)
          || empty($categoria)
          || empty($area)
          || empty($cantidad)
          || empty($medida)
        ) return ["error" => "campos vacios"];
        break;
    }

    $validate_elemento = $this->elemento_modelo->obtenerElementoPorCodigo($codigo);
    if ($validate_elemento) return ["error" => "elemento ya existe"];

    $result = $this->elemento_modelo->guardarElemento($codigo, $nombre, $tipo, $categoria, $area, $placa, $serial, $marca, $modelo, $cantidad, $medida);

    if ($result) return ["success" => true];

    return ["error" => "error al guardar elemento"];
  }

  public function obtenerTodosLosElementos()
  {
    $todos_los_elementos = $this->elemento_modelo->obtenerTodosLosElementos();

    if ($todos_los_elementos) return $todos_los_elementos;

    return ["error" => "error al obtener elementos"];
  }

  public function obtenerElementoPorCodigo($codigo)
  {
    if (empty($codigo)) return ["error" => "campos vacios"];

    $elemento = $this->elemento_modelo->obtenerElementoPorCodigo($codigo);

    if ($elemento) return $elemento;

    return ["error" => "elemento no existe"];
  }

  public function editarElemento($codigo, $nombre, $tipo, $categoria, $area, $placa = null, $serial = null, $marca = null, $modelo = null, $cantidad = null, $medida = null)
  {
    switch ($tipo) {
      case "devolutivo":
        if (
          empty($codigo)
          || empty($nombre)
          || empty($tipo)
          || empty($categoria)
          || empty($area)
          || empty($placa)
          || empty($serial)
          || empty($marca)
          || empty($modelo)
        ) return ["error" => "campos vacios"];
        break;

      case "consumible":
        if (
          empty($codigo)
          || empty($nombre)
          || empty($tipo)
          || empty($categoria)
          || empty($area)
          || empty($cantidad)
          || empty($medida)
        ) return ["error" => "campos vacios"];
        break;
    }

    $validate_elemento = $this->elemento_modelo->obtenerElementoPorCodigo($codigo);
    if (!$validate_elemento) return ["error" => "elemento no existe"];

    $result = $this->elemento_modelo->editarElemento($codigo, $nombre, $tipo, $categoria, $area, $placa, $serial, $marca, $modelo, $cantidad, $medida);
    if ($result) return ["success" => true];

    return ["error" => "error al actualizar"];
  }

  public function deshabilitarElemento($codigo)
  {
    if (empty($codigo)) return ["error" => "campos vacios"];

    $elemento = $this->elemento_modelo->obtenerElementoPorCodigo($codigo);
    if (!$elemento) return ["error" => "elemento no existe"];

    $deshabilitar_elemento = $this->elemento_modelo->deshabilitarElemento($codigo);

    if ($deshabilitar_elemento) return ["success" => true];

    return ["error" => "error al deshabilitar elemento"];
  }
}
