<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Centro de Notificaciones</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css ">
</head>
<body>

<!-- Barra superior -->
<div class="top-bar">
  <div class="notification-icon" id="notificationToggle">
    <i class="fas fa-bell" style="color:white;"></i>
    <span id="badge" class="notification-badge">0</span>
  </div>
</div>

<!-- Centro de notificaciones estilo Windows -->
<div class="windows-notification-center" id="notificationTray">
  <div class="notification-header">
    Notificaciones
    <span id="clearBtn" class="clear-btn">Limpiar</span>
  </div>

  <div class="notification-list" id="unreadList"></div>

  <div class="separator"></div>


  <div class="shutdown-icon" title="Cerrar bandeja" id="shutdownBtn">
    <i class="fas fa-power-off"></i>
  </div>

</div>

<div class="overlay" id="overlay"></div>

<script src="script.js"></script>
<script src="badge.js"></script>
</body>
</html>