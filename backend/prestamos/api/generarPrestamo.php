<?php
require_once '../../config/Database.php';
require_once '../controllers/prestamosController.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-type: application/json; charset=utf-8");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar que sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Metodo no permitido"]);
    exit();
}

// Recibir toda la data enviada en el body
// $datos = json_decode(file_get_contents("php://input"), true);

$datos = [
    'usuario_documento' => $_POST['usuario_documento'],
    'usertype' => $_POST['usertype'],
    'tipo_prestamo' => $_POST['tipo_prestamo'],
    'identificacion' => $_POST['identificacion'],
    'nombre_apellido' => $_POST['nombre_apellido'],
    'telefono' => $_POST['telefono'],
    'correo' => $_POST['correo'],
    'direccion' => $_POST['direccion'],
    'fecha_entrega' => $_POST['fecha_entrega'],
    'fecha_devolucion' => $_POST['fecha_devolucion'],
    'destino_general' => $_POST['destino_general'],
    'devolutivos' => $_POST['devolutivos'],
    'consumibles' => $_POST['consumibles'],
    'observaciones' => $_POST['observaciones']
];

// print_r($datos);

if (!$datos || !is_array($datos)) {
    http_response_code(400);
    echo json_encode(["error" => "Datos invalidos"]);
    exit;
}

$controller = new prestamosController();

try {
    // Pasar toda la data al método del controlador
    $resultado = $controller->crearSolicitud($datos);
    http_response_code(201);
    // error_log('[DEBUG] Datos recibidos en generarPrestamo.php: ' . json_encode($datos));
    echo json_encode([
        "success" => true,
        "id_solicitud" => $resultado,
        "message" => "Solicitud creada correctamente",
        "data_recibida" => $datos
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
