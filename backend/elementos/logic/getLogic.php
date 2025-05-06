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

$connection = new Database();

if ($connection) {
  $controller = new ElementoController($connection->connect());

  if (isset($_GET["codigo"])) {
    $codigo = (int) $_GET["codigo"];

    $result = $controller->getElementoByCodigo($codigo);
  } else {
    $result = $controller->getAllElementos();
  }

  if ($result) $output = $result;
}

echo json_encode($output);

exit();
