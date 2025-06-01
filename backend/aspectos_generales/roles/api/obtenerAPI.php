<?php
require_once '../../../config/Database.php';
require_once '../controller/RolController.php';

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

$conexion = new Database();

if ($conexion) {
  $controller = new RolController($conexion->connect());

  if (isset($_GET["rol_id"]) && is_numeric($_GET["rol_id"])) {
    $id = (int) $_GET["rol_id"];

    $result = $controller->obtenerRolPorId($id);
  } else {
    $result = $controller->obtenerTodosLosRoles();
  }

  if ($result) $output = $result;
} else {
  $output = ["error" => "error de conexion a la base de datos"];
}

echo json_encode($output);

exit();
