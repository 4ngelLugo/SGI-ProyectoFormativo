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

  $input = json_decode(file_get_contents('php://input'), true);

  $codigo = $input['code'] ?? null;
  $tipo = $input['type'] ?? null;

  $result = $controller->deactivateElemento($codigo, $tipo);

  if ($result) $output = $result;
} else {
  $output = ["error" => "database connection error"];
}

echo json_encode($output);

exit();
