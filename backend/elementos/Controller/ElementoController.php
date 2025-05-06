<?php
include '../Model/ElementoModel.php';

class ElementoController
{
  private $elemento_model;

  public function __construct($db)
  {
    $this->elemento_model = new ElementoModel($db);
  }

  public function saveElementoDevolutivo($codigo, $nombre, $area, $placa, $serial, $marca, $modelo)
  {
    if (empty($codigo) || empty($nombre) || empty($area) || empty($placa) || empty($serial) || empty($marca) || empty($modelo)) return ["error" => "campos vacios"];

    $validate_elemento = $this->getElementoByCodigo($codigo);
    if (empty($validate_elemento["error"])) return ["error" => "elemento ya existe"];

    $result = $this->elemento_model->saveElementoDevolutivo($codigo, $nombre, $area, $placa, $serial, $marca, $modelo);
    if ($result) return ["success" => true];

    return ["error" => "error al guardar"];
  }

  public function saveElementoConsumible($codigo, $nombre, $area, $cantidad, $medida)
  {
    if (empty($codigo) || empty($nombre) || empty($area) || empty($cantidad) || empty($medida)) return ["error" => "campos vacios"];

    $validate_elemento = $this->getElementoByCodigo($codigo);
    if (empty($validate_elemento["error"])) return ["error" => "elemento ya existe"];

    if ($medida === "m") $medida = "metros";
    else if ($medida === "und") $medida = "unidades";

    $medida = strtolower($medida);

    $result = $this->elemento_model->saveElementoConsumible($codigo, $nombre, $area, $cantidad, $medida);
    if ($result) return ["success" => true];

    return ["error" => "error al guardar"];
  }

  public function getAllElementos()
  {
    $get_elementos = $this->elemento_model->getAllElementos();

    if ($get_elementos) return $get_elementos;

    return ["error" => "error al obtener elementos"];
  }

  public function getElementoByCodigo($codigo)
  {
    if (empty($codigo)) return ["error" => "campos vacios"];

    $get_elemento = $this->elemento_model->getElementoByCodigo($codigo);

    if ($get_elemento) return $get_elemento;

    return ["error" => "elemento no existe"];
  }

  public function deactivateElemento($codigo, $tipo)
  {
    $tabla_tipo = strtolower($tipo) === 'consumible' ? $this->elemento_model->table_cons : $this->elemento_model->table_devo;

    $get_elemento = $this->elemento_model->getElementoByCodigo($codigo);

    if (!$get_elemento) return ["error" => "elemento no existe"];

    $deactivate_elemento = $this->elemento_model->deactivateElemento($codigo, $tabla_tipo);

    if ($deactivate_elemento) return ["success" => "elemento desactivado"];

    return ["error" => "error al deactivar el elemento"];
  }
}
