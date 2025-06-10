<?php

require_once '../models/Prestamo.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

try {
    $input = json_decode(file_get_contents("php://input"), true);

    if (
        !isset($input['prestamo_id']) ||
        !isset($input['fecha_devolucion']) ||
        !isset($input['estado_prestamo_id'])
    ) {
        http_response_code(400);
        echo json_encode(['mensaje' => 'Datos incompletos']);
        exit;
    }

    $prestamo_id = $input['prestamo_id'];
    $fecha_devolucion = $input['fecha_devolucion'];
    $estado_prestamo_id = $input['estado_prestamo_id'];

    // Llama al modelo para actualizar
    $resultado = Prestamo::editarPrestamo($prestamo_id, $fecha_devolucion, $estado_prestamo_id);

    if ($resultado) {
        echo json_encode(['mensaje' => 'Préstamo actualizado correctamente']);
    } else {
        http_response_code(500);
        echo json_encode(['mensaje' => 'No se pudo actualizar el préstamo']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['mensaje' => 'Error: ' . $e->getMessage()]);
}
?>