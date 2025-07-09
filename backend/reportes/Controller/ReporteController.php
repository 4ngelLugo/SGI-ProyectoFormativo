<?php
require_once '../Model/Reporte.php';
class ReporteController
{
  private $reporte_modelo;

  public function __construct($db)
  {
    $this->reporte_modelo = new Reporte($db);
  }

  public function ObtenerCuentaElementosPrestados()
  {
    $cuenta_elementos_prestados = $this->reporte_modelo->ObtenerCuentaElementosPrestados();

    if ($cuenta_elementos_prestados) {
      return $cuenta_elementos_prestados;
    }

    return ["error" => "error al obtener"];
  }

  public function ObtenerCuentaPrestamosUsuario()
  {
    $cuenta_prestamos_usuario = $this->reporte_modelo->ObtenerCuentaPrestamosUsuario();

    if ($cuenta_prestamos_usuario) {
      return $cuenta_prestamos_usuario;
    }

    return ["error" => "error al obtener"];
  }
}
