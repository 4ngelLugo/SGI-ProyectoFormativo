<?php
include '../Model/ElementoModel.php';

class ElementoController
{
  private $elementoModel;

  public function __construct($db)
  {
    $this->elementoModel = new ElementoModel($db);
  }

  public function saveElementoDevolutivo($codigo, $nombre, $area, $placa, $serial, $marca, $modelo)
  {
    $validate_elemento = $this->getElementoByCodigo($codigo, $this->elementoModel->table_devo);
    if (empty($validate_elemento["error"])) return ["error" => "elemento ya existe"];

    if (empty($codigo) || empty($nombre) || empty($area) || empty($placa) || empty($serial) || empty($marca) || empty($modelo)) return ["error" => "campos vacios"];

    $result = $this->elementoModel->saveElementoDevolutivo($codigo, $nombre, $area, $placa, $serial, $marca, $modelo);
    if ($result) return ["success" => true];

    return ["error" => "error al guardar"];
  }

  public function saveElementoConsumible($codigo, $nombre, $area, $cantidad)
  {
    $validate_elemento = $this->getElementoByCodigo($codigo, $this->elementoModel->table_cons);
    if (empty($validate_elemento["error"])) return ["error" => "elemento ya existe"];

    if (empty($codigo) || empty($nombre) || empty($area) || empty($cantidad)) return ["error" => "campos vacios"];

    $result = $this->elementoModel->saveElementoConsumible($codigo, $nombre, $area, $cantidad);
    if ($result) return ["success" => true];

    return ["error" => "error al guardar"];
  }

  public function getElementoByCodigo($codigo, $tabla_tipo)
  {
    $get_elemento = $this->elementoModel->getElementoByCodigo($codigo, $tabla_tipo);

    if ($get_elemento) return $get_elemento;

    return ["error" => "elemento no existe"];
  }
}
