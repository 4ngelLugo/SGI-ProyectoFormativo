<?php
require_once '../../config/Database.php';
require_once '../Controller/ElementoController.php';

// Cabeceras para permitir CORS y definir el tipo de contenido
// Estas cabeceras permiten que el frontend pueda hacer peticiones a este endpoint desde un origen diferente y el servidor responda con el tipoo de contenido adecuado (.JSON)
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-type: application/json; charset=utf-8");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

// Verificar que el metodo por el que se envian los datos sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(["error" => "metodo invalido"]);
  exit();
}

// Recibir todos los datos enviados por POST
$datos = [
  'codigo'        => $_POST['codigo'] ?? null,
  'nombre'        => $_POST['nombre'] ?? null,
  'tipo'          => $_POST['tipo'] ?? null,
  'categoria'     => $_POST['categoria'] ?? null,
  'area'          => $_POST['area'] ?? null,
  'placa'         => $_POST['placa'] ?? null,
  'serial'        => $_POST['serial'] ?? null,
  'marca'         => $_POST['marca'] ?? null,
  'modelo'        => $_POST['modelo'] ?? null,
  'cantidad'      => $_POST['cantidad'] ?? null,
  'medida'        => $_POST['medida'] ?? null,
  'recomendacion' => $_POST['recomendacion'] ?? null
];

// Conectar a la base de datos y verificar que la conexión sea exitosa
$database = new Database();
$conexion = $database->connect();

if (!$conexion) {
  http_response_code(500);
  echo json_encode(["error" => "error de conexion a la base de datos"]);
  exit();
}

$controller = new ElementoController($conexion);

$resultado = $controller->editarElemento($datos);

if (isset($resultado['error'])) {
  http_response_code(500);
  echo json_encode($resultado);
  $database->closeConnection();
  exit();
}

http_response_code(200);
echo json_encode($resultado);

// Cerrar la conexión a la base de datos
$database->closeConnection();

exit();
