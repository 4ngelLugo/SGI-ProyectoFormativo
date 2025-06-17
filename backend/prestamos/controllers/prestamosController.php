<?php
require_once '../models/Prestamo.php';

class PrestamosController
{

    public function crearSolicitud(array $data)
    {
        $idPrestamo = Prestamo::generarPrestamo($data);
        if ($data['usertype'] === 'Instructor') {
            $tipoPrestamo = "Reserva" ?? 'Prestamo inmediato';
        }
        // Solo notificar si es tipo Reserva
        if ($tipoPrestamo === 'Reserva') {
            $wsData = [
                'tipo' => 'reserva_nueva',
                'datos' => [
                    'prestamo_id' => $data['prestamo_id'] ?? $idPrestamo,
                    'usuario_documento' => $data['identificacion'] ?? '',
                    'fecha_solicitud' => $data['fecha_solicitud'] ?? '',
                ]
            ];
            // Notifica al servidor WebSocket vía HTTP POST
            $ch = curl_init('http://127.0.0.1:8083/notify');
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($wsData));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

            error_log('[WS] Enviando a Node: ' . json_encode($wsData));

            $result = curl_exec($ch);
            if ($result === false) {
                error_log('Error al notificar WebSocket: ' . curl_error($ch));
            } else {
                error_log('Respuesta del WebSocket: ' . $result);
            }
            curl_close($ch);
        }

        return $idPrestamo;
    }

    public function listarTodoPrestamos()
    {
        return Prestamo::listarPrestamos();
    }

    public function obtenerSolicitante(string $identificacion)
    {
        $solicitante = Prestamo::getSolicitanteByIdentificacion($identificacion);

        if (!$solicitante) {
            throw new Exception("No se encontró el solicitante");
        }

        return $solicitante;
    }

    public function actualizarPrestamo(array $data)
    {
        try {
            return Prestamo::actualizarPrestamoCompleto($data);
        } catch (Exception $e) {
            throw new Exception("Error en controlador: " . $e->getMessage());
        }
    }

    public function obtenerPrestamoCompleto(string $prestamo_id)
    {
        try {
            return Prestamo::obtenerPrestamoCompleto($prestamo_id);
        } catch (Exception $e) {
            throw new Exception("Error en controlador: " . $e->getMessage());
        }
    }

    public static function inhabilitarPrestamo(string $prestamo_id): bool
    {
        try {
            return Prestamo::inhabilitarPrestamo($prestamo_id);
        } catch (Exception $e) {
            throw new Exception("Error en controlador: " . $e->getMessage());
        }
    }
}
