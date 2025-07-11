const rolId = 1;

function fetchUnreadCount() {
  fetch('api/obtenerNotificaciones.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rol_id: rolId })
  })
  .then(res => {
    if (!res.ok) throw new Error('Error en la API');
    return res.json();
  })
  .then(data => {
    const badge = document.getElementById('badge');
    const totalCount = Array.isArray(data.notifications) ? data.notifications.length : 0;

    if (badge) {
      badge.textContent = totalCount > 9 ? '9+' : totalCount;
      badge.style.display = totalCount > 0 ? 'block' : 'none';
    }
  })
  .catch(err => {
    console.error('Error al obtener cantidad de notificaciones:', err);
  });
}

document.addEventListener("DOMContentLoaded", fetchUnreadCount);
