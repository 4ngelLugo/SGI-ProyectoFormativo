const userId = 123;

function fetchUnreadCount() {
  fetch('api/obtenerNotificaciones.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId })
  })
  .then(res => {
    if (!res.ok) throw new Error('Error en la API');
    return res.json();
  })
  .then(data => {
    const unreadCount = data.notifications.filter(n => !n.leido).length;
    const badge = document.getElementById('badge');

    if (badge) {
      badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
      badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
  })
  .catch(err => {
    console.error('Error al obtener cantidad de no leídas:', err);
  });
}


document.addEventListener("DOMContentLoaded", fetchUnreadCount);