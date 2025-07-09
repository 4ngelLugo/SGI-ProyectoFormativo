<?php
require_once '../models/Prestamo.php';
require_once __DIR__ . '/../../elementos/Model/Elemento.php';
require_once __DIR__ . '/../../solicitantes/Model/Solicitante.php';

class PrestamoController
{
  private $prestamo_modelo;
  private $elemento_modelo;
  private $solicitante_modelo;


  public function __construct($db)
  {
    $this->elemento_modelo = new Elemento($db);
    $this->solicitante_modelo = new Solicitante($db);
    $this->prestamo_modelo = new Prestamo(
      $db,
      $this->elemento_modelo,
      $this->solicitante_modelo
    );
  }

  public function generarPrestamo(array $data)
  {
    // Validar que los campos requeridos no esten vacios
    if (
      empty($data['identificacion']) ||
      empty($data['nombre_apellido']) ||
      empty($data['correo']) ||
      empty($data['telefono']) ||
      empty($data['direccion']) ||
      empty($data['usuario_documento']) ||
      empty($data['fecha_entrega']) ||
      empty($data['fecha_devolucion']) ||
      empty($data['devolutivos']) ||
      empty($data['consumibles']) ||
      empty($data['destino_general'])
    ) return ["error" => "campos vacios"];

    // Establece el tipo de prestamo, según la fecha que se establezca para entregarle los elementos al solicitante
    $today = date("Y-m-d");
    $data['tipo_prestamo'] =
      $data['fecha_entrega'] == $today ?
      'inmediato' : 'reserva';

    // Si hay consumibles seleccionados, valida que se haya establecido una cantidad a prestar
    foreach ($data['consumibles'] as $consumible) {
      if (!empty($data['consumibles'][0]['codigo']) && empty($consumible['cantidad'])) return ["error" => "cantidad vacia"];
    }

    // Generar el prestamo desde el modelo y recibir mensajes de exito o error
    $resultado = $this->prestamo_modelo->generarPrestamo($data);
    if ($resultado) return $resultado;

    return ["error" => "error al guardar prestamo"];
  }

  public function obtenerTodosLosPrestamos()
  {
    // Obtiene todos los elementos desde el modelo y recibe mensajes de exito o error
    $resultado = $this->prestamo_modelo->obtenerTodosLosPrestamos();
    if ($resultado) return $resultado;

    return ["error" => "error al obtener prestamos"];
  }

  public function obtenerPrestamoPorID(int $prestamo_id)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($prestamo_id)) return ["error" => "campos vacios prestamo"];

    // Obtiene el elemento desde el modelo y recibe mensajes de exito o error
    $resultado = $this->prestamo_modelo->obtenerPrestamoPorID($prestamo_id);
    if ($resultado) return $resultado;

    return ["error" => "error al obtener prestamo"];
  }

  public function editarObservacionPrestamo(int $prestamo_id, string $observacion)
  {
    if (empty($prestamo_id)) return ["error" => "campos vacios prestamo"];

    $resultado = $this->prestamo_modelo->editarObservacionPrestamo($prestamo_id, $observacion);
    if ($resultado) return $resultado;

    return ["error" => "error al editar prestamo"];
  }

  public function cambiarEstadoPrestamo(int $prestamo_id, int $estado)
  {
    if (empty($prestamo_id) || empty($estado)) return ["error" => "campos vacios"];

    // Validar que el elemento a editar exista el la base de datos antes de intentar editarlo
    $validar_elemento = $this->prestamo_modelo->obtenerPrestamoPorID($prestamo_id);
    if (!$validar_elemento) return ["error" => "no existe prestamo"];

    $resultado = $this->prestamo_modelo->cambiarEstadoPrestamo($prestamo_id, $estado);
    if ($resultado) return $resultado;

    return ["error" => "error al editar prestamo"];
  }

  public function inhabilitarPrestamo(int $prestamo_id)
  {
    if (empty($prestamo_id)) return ["error" => "campos vacios"];

    // Validar que el elemento a editar exista el la base de datos antes de intentar editarlo
    $validar_elemento = $this->prestamo_modelo->obtenerPrestamoPorID($prestamo_id);
    if (!$validar_elemento) return ["error" => "no existe prestamo"];

    $resultado = $this->prestamo_modelo->inhabilitarPrestamo($prestamo_id);
    if ($resultado) return $resultado;

    return ["error" => "error al editar prestamo"];
  }
}
