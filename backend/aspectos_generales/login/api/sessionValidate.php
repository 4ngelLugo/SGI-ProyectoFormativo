<?php
require_once '../../../config/Database.php';
require_once '../controllers/AuthController.php';

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

// Verificar que el metodo por el que se envian los datos sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(["error" => "metodo invalido"]);
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

$respuesta = [];
$documento = $_POST['documento'] ?? null;
$contrasena = $_POST['contrasena'] ?? null;

$auth = new Auth($conexion);

$resultado = $auth->autenticar($documento, $contrasena);

if (isset($resultado['error'])) {
  http_response_code(500);
  echo json_encode($resultado);
  $database->closeConnection();
  exit();
}

$usuario = $auth->obtenerUsuario();

if (isset($usuario['error'])) {
  http_response_code(500);
  echo json_encode($usuario);
  $database->closeConnection();
  exit();
}

$respuesta = [
  'success' => true,
  'mensaje' => 'Autenticación exitosa',
  'user' => [
    'documento' => $usuario['documento'],
    'nombre' => $usuario['nombres'] . " " . $usuario['apellidos'],
    'rol' => $usuario['rol'],
    'rolNombre' => $usuario['rolNombre'],
  ]
];

http_response_code(200);
echo json_encode($respuesta);

// Cerrar la conexión a la base de datos
$database->closeConnection();

exit();
