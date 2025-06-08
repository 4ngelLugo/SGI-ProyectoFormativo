<?php
require_once '../../config/Database.php';
require_once '../Controller/UsuarioController.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-type: application/json; charset=utf-8");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

$output = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $connection = new Database();

  if ($connection) {

    $controller = new UsuarioController($connection->connect());

    $documento = $_POST["documento"] ?? null;
    $tipo_documento = $_POST["tipo_documento"] ?? null;
    $nombres = $_POST["nombres"] ?? null;
    $apellidos = $_POST["apellidos"] ?? null;
    $telefono = $_POST["telefono"] ?? null;
    $direccion = $_POST["direccion"] ?? null;
    $correo = $_POST["correo"] ?? null;
    $rol = $_POST["rol"] ?? null;

    $result = $controller->editarUsuario($documento, $tipo_documento, $nombres, $apellidos, $telefono, $direccion, $correo, $rol);

    if ($result) $output = $result;
  } else {
    $output = ["error" => "error de conexion a la base de datos"];
  }
} else {
  $output = ["error" => "metodo invalido"];
}

echo json_encode($output);

exit();
