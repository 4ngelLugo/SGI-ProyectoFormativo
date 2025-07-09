<?php
require_once '../../config/Database.php';
require_once '../Controller/ElementoController.php';

// Cabeceras para permitir CORS y definir el tipo de contenido
// Estas cabeceras permiten que el frontend pueda hacer peticiones a este endpoint desde un origen diferente y el servidor responda con el tipoo de contenido adecuado (.JSON)
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-type: application/json; charset=utf-8");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

// Conectar a la base de datos y verificar que la conexión sea exitosa
$database = new Database();
$conexion = $database->connect();

if (!$conexion) {
  http_response_code(500);
  echo json_encode(["error" => "error de conexion a la base de datos"]);
  exit();
}

$controller = new ElementoController($conexion);

// Si se hace la petición con un código específico, se obtiene ese elemento. Sino se obtienen todos
if (isset($_GET["codigo"])) {
  $codigo = $_GET["codigo"];

  $resultado = $controller->obtenerElementoPorCodigo($codigo);
} else {
  $resultado = $controller->obtenerTodosLosElementos();
}

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
