document.addEventListener("DOMContentLoaded", function () {
    const notificationToggle = document.getElementById('notificationToggle');
    const notificationTray = document.getElementById('notificationTray');

    const unreadList = document.getElementById('unreadList');
    const readList = document.getElementById('readList');

    const userId = 123;

    function fetchNotifications() {
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
                renderNotifications(data.notifications);
            })
            .catch(err => {
                console.error('Error al obtener notificaciones:', err);
            });
    }

    function renderNotifications(notifications) {
        unreadList.innerHTML = '';
        readList.innerHTML = '';

        const unread = [];
        const read = [];

        notifications.sort((a, b) => new Date(b.fecha_notificacion) - new Date(a.fecha_notificacion));

        notifications.forEach(n => {
            const container = n.leido ? read : unread;
            container.push(n);
        });

        unread.forEach(n => {
            const div = createNotificationElement(n);
            unreadList.appendChild(div);
        });

        read.forEach(n => {
            const div = createNotificationElement(n);
            div.classList.add('read');
            readList.appendChild(div);
        });
    }

    function updateBadge() {
        fetch('api/obtenerNotificaciones.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        })
            .then(res => res.json())
            .then(data => {
                const badge = document.getElementById('badge');
                const unreadCount = data.notifications.filter(n => !n.leido).length;

                badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
                badge.style.display = unreadCount > 0 ? 'block' : 'none';
            });
    }

    function createNotificationElement(notification) {
        const div = document.createElement('div');
        div.className = `notification tipo-${notification.tipo_notificacion.toLowerCase()}`;

        const maxLength = 40;
        const isLong = notification.mensaje.length > maxLength;

        // Contenido
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

        // Estructura final
        div.appendChild(typeLabel);
        div.appendChild(messageContainer);
        div.appendChild(dateEl);

        if (isLong) {
            div.appendChild(expandBtn);
        }

        div.addEventListener('click', (e) => {

            if (e.target === expandBtn) return;

            if (!notification.leido) {
                markAsRead(notification.notificacion_id, notification);
                messageContainer.textContent = notification.mensaje;
            }
        });

        // Botón "Ver más"
        expandBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            if (!notification.leido) {
                markAsRead(notification.notificacion_id, notification);
            }

            messageContainer.textContent = notification.mensaje;
            expandBtn.remove();
        });

        return div;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Limpiar notificaciones
    document.getElementById('clearBtn')?.addEventListener('click', () => {
        fetch('api/borrarNotificaciones.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        }).then(() => fetchNotifications());
    });

    function markAsRead(notificationId, notificationData) {
        fetch('api/marcarLeida.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, notification_id: notificationId })
        }).then(() => {
            notificationData.leido = true;
            fetchNotifications();
            updateBadge(); 
        });
    }

    // Abrir/cerrar bandeja
    notificationToggle.addEventListener('click', () => {
        notificationTray.classList.toggle('open');
        if (notificationTray.classList.contains('open')) {
            fetchNotifications(); // Cargar solo si se abre
        }
    });

    // Cerrar si se hace clic fuera
    document.addEventListener('click', (event) => {
        if (!notificationTray.contains(event.target) && !notificationToggle.contains(event.target)) {
            notificationTray.classList.remove('open');
        }
    });
});