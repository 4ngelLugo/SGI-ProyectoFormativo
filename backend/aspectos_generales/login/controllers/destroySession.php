
<?php
session_start();

if (isset($_SESSION['user_id'])) {
    $_SESSION = array();
    session_unset();
    session_destroy();
    echo json_encode([
        'status' => 'success',
        'message' => 'Sesión cerrada con éxito'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'No hay sesión activa'
    ]);
}
?>  