<?php
require_once '../../../config/Database.php';
require_once '../controller/CategoriaController.php';

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
  $conexion = new Database();

  if ($conexion) {
    $controller = new CategoriaController($conexion->connect());

    $id = $_POST["categoria_id"] ?? null;
    $nombre = $_POST["categoria_nombre"] ?? null;

    $result = $controller->editarCategoria($id, $nombre);

    if ($result) $output = $result;
  } else {
    $output = ["error" => "error de conexion a la base de datos"];
  }
} else {
  $output = ["error" => "metodo invalido"];
}

echo json_encode($output);

exit();
