<?php
require_once '../../config/Database.php';
require_once '../Controller/ElementoController.php';

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

    $controller = new ElementoController($conexion->connect());

    $codigo = $_POST["ele_codigo"] ?? null;
    $nombre = $_POST["ele_nombre"] ?? null;
    $tipo = $_POST["ele_tipo"] ?? null;
    $categoria = $_POST["ele_categoria"] ?? null;
    $area = $_POST["ele_area"] ?? null;
    $placa = $_POST["ele_placa"] ?? null;
    $serial = $_POST["ele_serial"] ?? null;
    $marca = $_POST["ele_marca"] ?? null;
    $modelo = $_POST["ele_modelo"] ?? null;
    $cantidad = $_POST["ele_cant"] ?? null;
    $medida = $_POST["ele_medida"] ?? null;

    $result = $controller->guardarElemento($codigo, $nombre, $tipo, $categoria, $area, $placa, $serial, $marca, $modelo, $cantidad, $medida);

    if ($result) $output = $result;
  } else {
    $output = ["error" => "error de conexion a la base de datos"];
  }
} else {
  $output = ["error" => "metodo invalido"];
}

echo json_encode($output);

exit();
