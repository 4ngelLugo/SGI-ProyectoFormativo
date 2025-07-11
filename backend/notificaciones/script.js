document.addEventListener("DOMContentLoaded", function () {
    const notificationToggle = document.getElementById('notificationToggle');
    const notificationTray = document.getElementById('notificationTray');
    const unreadList = document.getElementById('unreadList');

    const rolId = 1; 

    function fetchNotifications() {
        fetch('api/obtenerNotificaciones.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rol_id: rolId })
        })
        .then(res => res.json())
        .then(data => {
            renderNotifications(data.notifications || []);
        })
        .catch(err => console.error('Error al obtener notificaciones:', err));
    }

    function renderNotifications(notifications) {
        unreadList.innerHTML = '';

        notifications.sort((a, b) => new Date(b.fecha_notificacion) - new Date(a.fecha_notificacion));

        notifications.forEach(n => {
            const div = createNotificationElement(n);
            unreadList.appendChild(div);
        });
    }

    function updateBadge() {
        fetch('api/obtenerNotificaciones.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rol_id: rolId })
        })
        .then(res => res.json())
        .then(data => {
            const badge = document.getElementById('badge');
            const count = Array.isArray(data.notifications) ? data.notifications.length : 0;
    
            badge.textContent = count > 9 ? '9+' : count;
            badge.style.display = count > 0 ? 'block' : 'none';
        })
        .catch(err => {
            console.error('Error al obtener cantidad de notificaciones:', err);
        });
    }
    
    

    function createNotificationElement(notification) {
        const div = document.createElement('div');
        div.className = `notification tipo-${notification.tipo_notificacion.toLowerCase()}`;

        const maxLength = 40;
        const isLong = notification.mensaje.length > maxLength;

        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-content';
        messageContainer.textContent = isLong
            ? notification.mensaje.slice(0, maxLength) + '...'
            : notification.mensaje;

        const dateEl = document.createElement('div');
        dateEl.className = 'date';
        dateEl.textContent = formatDate(notification.fecha_notificacion);

        const expandBtn = document.createElement('div');
        expandBtn.className = 'expand-btn';
        expandBtn.textContent = 'Ver más';

        const typeLabel = document.createElement('div');
        typeLabel.className = 'type-label';
        typeLabel.textContent = notification.tipo_notificacion;

        div.appendChild(typeLabel);
        div.appendChild(messageContainer);
        div.appendChild(dateEl);
        if (isLong) div.appendChild(expandBtn);

        expandBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            messageContainer.textContent = notification.mensaje;
            expandBtn.remove();
        });

        return div;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }


    notificationToggle.addEventListener('click', () => {
        notificationTray.classList.toggle('open');
        if (notificationTray.classList.contains('open')) {
            fetchNotifications();
        }
    });

    document.addEventListener('click', (event) => {
        if (!notificationTray.contains(event.target) && !notificationToggle.contains(event.target)) {
            notificationTray.classList.remove('open');
        }
    });

    updateBadge();
});
