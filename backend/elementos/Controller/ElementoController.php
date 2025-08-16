<?php
require_once __DIR__ . '/../Model/Elemento.php';

class ElementoController
{
  protected $elemento_modelo;

  public function __construct($db)
  {
    $this->elemento_modelo = new Elemento($db);
  }

  public function guardarElemento(array $datos)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($datos['tipo'])) return ["error" => "tipo no especificado"];

    switch ($datos['tipo']) {
      case "devolutivo":
        if (
          empty($datos['codigo'])
          || empty($datos['nombre'])
          || empty($datos['categoria'])
          || empty($datos['area'])
          || empty($datos['placa'])
          || empty($datos['serial'])
          || empty($datos['marca'])
          || empty($datos['modelo'])
        ) return ["error" => "campos vacios"];
        break;

      case "consumible":
        if (
          empty($datos['codigo'])
          || empty($datos['nombre'])
          || empty($datos['categoria'])
          || empty($datos['area'])
          || empty($datos['cantidad'])
          || empty($datos['medida'])
        ) return ["error" => "campos vacios"];
        break;
    }

    // Validar que no exista un elemento con el mismo codigo en la base de datos antes de crear uno nuevo
    $validar_elemento = $this->elemento_modelo->obtenerElementoPorCodigo($datos['codigo']);
    if (isset($validar_elemento['codigo'])) return ["error" => "ya existe elemento"];

    // Crear el elemento desde el modelo y recibe mensajes de exito o error
    $resultado = $this->elemento_modelo->guardarElemento($datos);
    if ($resultado) return $resultado;

    return ["error" => "error al guardar elemento"];
  }

  public function obtenerTodosLosElementos()
  {
    // Obtiene todos los elementos desde el modelo y recibe mensajes de exito o error
    $resultado = $this->elemento_modelo->obtenerTodosLosElementos();
    if ($resultado) return $resultado;

    return ["error" => "error al obtener elementos"];
  }

  public function obtenerElementoPorCodigo(string $codigo)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($codigo)) return ["error" => "campos vacios elemento"];

    // Obtiene el elemento desde el modelo y recibe mensajes de exito o error
    $resultado = $this->elemento_modelo->obtenerElementoPorCodigo($codigo);
    if ($resultado) return $resultado;

    return ["error" => "error al obtener elemento"];
  }

  public function editarElemento(array $datos)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($datos['tipo'])) return ["error" => "tipo no especificado"];

    switch ($datos['tipo']) {
      case "devolutivo":
        if (
          empty($datos['codigo'])
          || empty($datos['nombre'])
          || empty($datos['categoria'])
          || empty($datos['area'])
          || empty($datos['placa'])
          || empty($datos['serial'])
          || empty($datos['marca'])
          || empty($datos['modelo'])
        ) return ["error" => "campos vacios"];
        break;

      case "consumible":
        if (
          empty($datos['codigo'])
          || empty($datos['nombre'])
          || empty($datos['categoria'])
          || empty($datos['area'])
          || empty($datos['cantidad'])
          || empty($datos['medida'])
        ) return ["error" => "campos vacios"];
        break;
    }

    // Validar que el elemento a editar exista el la base de datos antes de intentar editarlo
    $validar_elemento = $this->elemento_modelo->obtenerElementoPorCodigo($datos['codigo']);
    if (!$validar_elemento) return ["error" => "no existe elemento"];

    // Editar el elemento desde el modelo y recibir mensajes de exito o error
    $resultado = $this->elemento_modelo->editarElemento($datos);
    if ($resultado) return $resultado;

    return ["error" => "error al editar elemento"];
  }

  public function cambiarCantidadConsumible(string $codigo, string $operacion, int $cantidad) {
    // Validar que los campos requeridos no esten vacios
    if (empty($codigo) || empty($operacion) || empty($cantidad)) return ["error" => "campos vacios"];

    // Validar que el elemento a editar exista el la base de datos antes de intentar editarlo
    $validar_elemento = $this->elemento_modelo->obtenerElementoPorCodigo($codigo);
    if (!$validar_elemento) return ["error" => "no existe elemento"];

    // Cambiar la cantidad del elemento desde el modelo y recibir mensajes de exito o error
    $resultado = $this->elemento_modelo->cambiarCantidadConsumible($codigo, $operacion, $cantidad);
    if ($resultado) return $resultado;

    return ["error" => "error al editar elemento"];
  }

  public function deshabilitarElemento(string $codigo)
  {
    // Validar que los campos requeridos no esten vacios
    if (empty($codigo)) return ["error" => "campos vacios"];

    // Validar que el elemento a editar exista el la base de datos antes de intentar editarlo
    $validar_elemento = $this->elemento_modelo->obtenerElementoPorCodigo($codigo);
    if (!$validar_elemento) return ["error" => "no existe elemento"];

    // Deshabilitar el elemento desde el modelo y recibir mensajes de exito o error
    $resultado = $this->elemento_modelo->deshabilitarElemento($codigo);
    if ($resultado) return $resultado;

    return ["error" => "error al desactivar elemento"];
  }
}
