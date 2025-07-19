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
    // Validar que los campos requeridos no esten vacios
    if (empty($nombre)) return ["error" => "no nombre"];

    // Validar que no exista un tipo de documento con el mismo nombre en la base de datos antes de crear uno nuevo
    $verificar_tipo_documento = $this->tipo_documento_modelo->obtenerTipoDocumentoPorNombre($nombre);
    if ($verificar_tipo_documento) return ["error" => "ya existe tipo documento"];

    // Crear el tipo de documento desde el modelo y recibe mensajes de exito o error
    $resultado = $this->tipo_documento_modelo->guardarTipoDocumento($nombre);
    if ($resultado) return $resultado;

    return ["error" => "error al guardar tipo documento"];
  }

  public function obtenerTodosLosTipoDocumentos()
  {
    // Obtiene todos los tipos de documento desde el modelo y recibe mensajes de exito o error
    $resultado = $this->tipo_documento_modelo->obtenerTodosLosTipoDocumentos();
    if ($resultado) return $resultado;

    return ["error" => "error al obtener tipos documento"];
  }

  public function obtenerTipoDocumentoPorId($id)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($id)) return ["error" => "campos vacios tipo documento"];

    // Obtiene el tipo de documento desde el modelo y recibe mensajes de exito o error
    $resultado = $this->tipo_documento_modelo->obtenerTipoDocumentoPorId($id);
    if ($resultado) return $resultado;

    return ["error" => "error al obtener tipo documento"];
  }

  public function obtenerTipoDocumentoPorNombre($nombre)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($nombre)) return ["error" => "campos vacios tipo documento"];

    // Obtiene el tipo de documento desde el modelo y recibe mensajes de exito o error
    $resultado = $this->tipo_documento_modelo->obtenerTipoDocumentoPorNombre($nombre);
    if ($resultado) return $resultado;

    return ["error" => "error al obtener tipo documento"];
  }

  public function editarTipoDocumento($id, $nombre)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($id) || empty($nombre)) return ["error" => "campos vacios"];

    // Validar que el tipo de documento a editar exista el la base de datos antes de intentar editarlaF
    $verificar_tipo_documento = $this->tipo_documento_modelo->obtenerTipoDocumentoPorId($id);
    if (!$verificar_tipo_documento) return ["error" => "no existe tipo documento"];

    // Editar el tipo de documento desde el modelo y recibir mensajes de exito o error
    $resultado = $this->tipo_documento_modelo->editarTipoDocumento($id, $nombre);
    if ($resultado) return $resultado;

    return ["error" => "error al editar tipo documento"];
  }

  public function desactivarTipoDocumento($id)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($id)) return ["error" => "campos vacios"];

    // Validar que el tipo de documento a desactivar exista en la base de datos antes de intentar desactivarlo
    $verificar_tipo_documento = $this->tipo_documento_modelo->obtenerTipoDocumentoPorId($id);
    if (!$verificar_tipo_documento) return ["error" => "no existe tipo documento"];

    // Desactivar el tipo de documento desde el modelo y recibir mensajes de exito o error
    $resultado = $this->tipo_documento_modelo->desactivarTipoDocumento($id);
    if ($resultado) return $resultado;

    return ["error" => "error al desactivar tipo documento"];
  }
}
