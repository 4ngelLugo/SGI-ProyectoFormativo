<?php
require_once '../../../config/Database.php';
require_once '../controller/AreaController.php';

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
  $controller = new AreaController($conexion->connect());

  if (isset($_GET["area_id"]) && is_numeric($_GET["area_id"])) {
    $id = (int) $_GET["area_id"];

    $result = $controller->obtenerAreaPorId($id);
  } else {
    $result = $controller->obtenerTodasLasAreas();
  }

  if ($result) $output = $result;
} else {
  $output = ["error" => "error de conexion a la base de datos"];
}

echo json_encode($output);

exit();
