<?php
include_once '../model/TipoDocumento.php';

class TipoDocumentoController
{
  private $tipo_documento_modelo;

  public function __construct($db)
  {
    $this->tipo_documento_modelo = new TipoDocumentoModel($db);
  }

  public function guardarTipoDocumento($nombre)
  {
    if (empty($nombre)) return ["error" => "campos vacios"];

    $verificar_tipo_documento = $this->tipo_documento_modelo->obtenerTipoDocumentoPorNombre($nombre);
    if ($verificar_tipo_documento) return ["error" => "ya existe"];

    $guardar_tipo_documento = $this->tipo_documento_modelo->guardarTipoDocumento($nombre);
    if ($guardar_tipo_documento) return ["success" => true];

    return ["error" => "error al guardar"];
  }

  public function obtenerTodosLosTipoDocumentos()
  {
    $todas_las_tipo_documentos = $this->tipo_documento_modelo->obtenerTodosLosTipoDocumentos();

    if ($todas_las_tipo_documentos) return $todas_las_tipo_documentos;

    return ["error" => "error al obtener"];
  }

  public function obtenerTipoDocumentoPorId($id)
  {
    if (empty($id)) return ["error" => "campos vacios"];

    $tipo_documento = $this->tipo_documento_modelo->obtenerTipoDocumentoPorId($id);

    if ($tipo_documento) return $tipo_documento;

    return ["error" => "error al obtener por id"];
  }

  public function obtenerTipoDocumentoPorNombre($nombre)
  {
    if (empty($nombre)) return ["error" => "campos vacios"];

    $tipo_documento = $this->tipo_documento_modelo->obtenerTipoDocumentoPorNombre($nombre);

    if ($tipo_documento) return $tipo_documento;

    return ["error" => "error al obtener por nombre"];
  }

  public function editarTipoDocumento($id, $nombre)
  {
    if (empty($id) || empty($nombre)) return ["error" => "campos vacios"];

    $verificar_tipo_documento = $this->tipo_documento_modelo->obtenerTipoDocumentoPorId($id);
    if (!$verificar_tipo_documento) return ["error" => "no existe"];

    $editar_tipo_documento = $this->tipo_documento_modelo->editarTipoDocumento($id, $nombre);
    if ($editar_tipo_documento) return ["success" => true];

    return ["error" => "error al editar"];
  }

  public function desactivarTipoDocumento($id)
  {
    if (empty($id)) return ["error" => "campos vacios"];

    $verificar_tipo_documento = $this->tipo_documento_modelo->obtenerTipoDocumentoPorId($id);
    if (!$verificar_tipo_documento) return ["error" => "no existe"];

    $desactivar_tipo_documento = $this->tipo_documento_modelo->desactivarTipoDocumento($id);
    if ($desactivar_tipo_documento) return ["success" => true];

    return ["error" => "error al desactivar"];
  }
}
