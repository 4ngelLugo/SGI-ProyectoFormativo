<?php
require_once '../Model/Solicitante.php';

class SolicitanteController
{
  private $solicitante_modelo;

  public function __construct($db)
  {
    $this->solicitante_modelo = new Solicitante($db);
  }

  public function obtenerTodosLosSolicitantes()
  {
    // Obtiene todos los solicitantes desde el modelo y recibe mensajes de exito o error
    $resultado = $this->solicitante_modelo->obtenerTodosLosSolicitantes();
    if ($resultado) return $resultado;

    return ["error" => "error al obtener"];
  }

  public function obtenerSolicitantePorDocumento(int $documento)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($documento)) return ["error" => "campos vacios"];

    // Obtiene el solicitante desde el modelo y recibe mensajes de exito o error
    $resultado = $this->solicitante_modelo->obtenerSolicitantePorDocumento($documento);
    if ($resultado) return $resultado;

    return ["error" => "no existe"];
  }
}
