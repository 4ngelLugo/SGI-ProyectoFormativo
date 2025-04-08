<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

ob_start();

session_start();

require_once '../models/Auth.php';
require_once '../models/User.php';

// Process the request
$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData, true);
    
    if (isset($data['document']) && isset($data['password'])) {
        $auth = new Auth($data['document'], $data['password']);
        
        if ($auth->authenticate()) {
            $userData = $auth->getUserData();
            
            $dbCredentials = $auth->getUserDbCredentials();
            
            $userData['db_username'] = $dbCredentials['db_username'];
            $userData['db_password'] = $dbCredentials['db_password'];
            
            $auth->closeConnection();
            
            try {
                $user = new User($userData);
                
                $_SESSION['user_id'] = $userData['ID_Usuario'];
                $_SESSION['user_name'] = $userData['nombre'];
                $_SESSION['user_role'] = $userData['ID_Rol'];
                $_SESSION['user_document'] = $userData['Numero_Documento'];

                $response = [
                    'status' => 'success',
                    'message' => 'Autenticación exitosa',
                    'user' => [
                        'id' => $userData['ID_Usuario'],
                        'name' => $userData['nombre'],
                        'role' => $userData['ID_Rol'],
                        'document' => $userData['Numero_Documento']
                    ]
                ];
            } catch (Exception $e) {
                $response = [
                    'status' => 'error',
                    'message' => 'Error al crear la sesión de usuario: ' . $e->getMessage()
                ];
            }
        } else {
            $response = [
                'status' => 'error',
                'message' => 'Numero de documento o contraseña incorrectos'
            ];
        }
    } else {
        $response = [
            'status' => 'error',
            'message' => 'Documento y contraseña son requeridos'
        ];
    }
} else {
    $response = [
        'status' => 'error',
        'message' => 'Metodo de solicitud no válido'
    ];
}

ob_end_clean();
echo json_encode($response);
?>