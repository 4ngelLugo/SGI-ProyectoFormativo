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
  $connection = new Database();

  if ($connection) {

    $controller = new ElementoController($connection->connect());

    $codigo = $_POST["ele_codigo"] ?? null;
    $nombre = $_POST["ele_nombre"] ?? null;
    $area = $_POST["ele_area"] ?? null;

    switch ($_POST["tipo"]) {
      case "consumible":

        $cantidad = $_POST["ele_cant"] ?? null;

        $result = $controller->saveElementoConsumible($codigo, $nombre, $area, $cantidad);

        if ($result) $output = $result;
        break;

      case "devolutivo":
        $placa = $_POST["ele_placa"] ?? null;
        $serial = $_POST["ele_serial"] ?? null;
        $marca = $_POST["ele_marca"] ?? null;
        $modelo = $_POST["ele_modelo"] ?? null;

        $result = $controller->saveElementoDevolutivo($codigo, $nombre, $area, $placa, $serial, $marca, $modelo);

        if ($result) $output = $result;
        break;

      default:
        $output = ["error" => "invalid type"];
        break;
    }
  } else {
    $output = ["error" => "database connection error"];
  }
} else {
  $output = ["error" => "invalid method"];
}

echo json_encode($output);

exit();
