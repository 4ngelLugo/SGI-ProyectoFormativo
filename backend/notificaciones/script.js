document.addEventListener("DOMContentLoaded", function () {
    const notificationToggle = document.getElementById('notificationToggle');
    const notificationTray = document.getElementById('notificationTray');
    const unreadList = document.getElementById('unreadList');
    const rolId = 1;

    // Función para obtener notificaciones
    function fetchNotifications() {
        fetch('api/obtenerNotificaciones.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rol_id: rolId })
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data.notifications)) {
                // Limpiar posibles duplicados de la api
                const uniqueApiNotifications = data.notifications.filter(
                    (noti, index, self) => index === self.findIndex(
                        n => (n.notification_id || n.notificacion_id) === (noti.notification_id || noti.notificacion_id)
                    )
                );
                saveNotificationsToLocalStorage(uniqueApiNotifications);
            }
            renderNotifications();
        })
        .catch(err => console.error('Error al obtener notificaciones:', err));
    }

    // Guardar notificaciones en localStorage
    function saveNotificationsToLocalStorage(notifications) {
        const stored = getStoredNotifications();
        
        const normalizeId = (noti) => noti.notification_id || noti.notificacion_id || noti.id_notification;
        
        // Filtrar notificaciones que no existen en localStorage
        const newNotifications = notifications.filter(apiNoti => {
            const apiId = normalizeId(apiNoti);
            return !stored.some(localNoti => normalizeId(localNoti) === apiId);
        });
        
        // Combinar manteniendo las existentes y añadiendo las nuevas
        const updatedNotifications = [
            ...newNotifications.map(noti => ({ 
                ...noti,
                hidden: false,
                id_notification: normalizeId(noti)
            })),
            ...stored
        ];
        
        // Eliminar posibles duplicados restantes
        const uniqueNotifications = updatedNotifications.filter(
            (noti, index, self) => index === self.findIndex(
                n => normalizeId(n) === normalizeId(noti)
            )
        );
        
        localStorage.setItem('notifications', JSON.stringify(uniqueNotifications));
    }

    // Obtener notificaciones de localStorage
    function getStoredNotifications() {
        try {
            const stored = localStorage.getItem('notifications');
            if (!stored) return [];
            
            const parsed = JSON.parse(stored);
            
            return parsed.map(noti => {
                return {
                    id_notification: noti.notification_id || noti.notificacion_id || noti.id_notification,
                    rol_id: noti.rol_id || noti.roll_id,
                    tipo_notificacion: noti.tipo_notificacion || noti.tipo_notification,
                    mensaje: noti.mensaje,
                    fecha_notificacion: noti.fecha_notificacion,
                    hidden: noti.hidden || false,
                    titulo: noti.titulo || ''
                };
            }).filter(noti => noti.id_notification); // Filtrar entradas inválidas
        } catch (e) {
            console.error('Error al leer notificaciones:', e);
            return [];
        }
    }

    function cleanDuplicateNotifications() {
        const stored = getStoredNotifications();
        const uniqueNotifications = [];
        const ids = new Set();
        
        stored.forEach(noti => {
            const id = noti.id_notification;
            if (!ids.has(id)) {
                ids.add(id);
                uniqueNotifications.push(noti);
            }
        });
        
        localStorage.setItem('notifications', JSON.stringify(uniqueNotifications));
    }
    
    cleanDuplicateNotifications();

    // Función para renderizar notificaciones (solo las no ocultas)
    function renderNotifications() {
        unreadList.innerHTML = '';
        
        const stored = getStoredNotifications();
        const ids = new Set();
        
        stored
            .filter(noti => !noti.hidden)
            .sort((a, b) => new Date(b.fecha_notificacion) - new Date(a.fecha_notificacion))
            .forEach(noti => {
                if (!ids.has(noti.id_notification)) {
                    ids.add(noti.id_notification);
                    const div = createNotificationElement(noti);
                    unreadList.appendChild(div);
                }
            });
        
        updateBadge();
    }

    // Actualizar badge de notificaciones
    function updateBadge() {
        const stored = getStoredNotifications();
        const count = stored.filter(n => !n.hidden).length;
        const badge = document.getElementById('badge');
        if (badge) {
            badge.textContent = count > 9 ? '9+' : count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    }

    function createNotificationElement(notification) {
        const div = document.createElement('div');
        div.className = `notification tipo-${notification.tipo_notificacion.toLowerCase()}`;
        
        // Contenedor principal
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'notification-content';
        
        // Titulo
        const titleEl = document.createElement('div');
        titleEl.className = 'notification-title';
        titleEl.textContent = notification.titulo || 'Sin título';
        
        // Mensaje (versión corta)
        const messageEl = document.createElement('div');
        messageEl.className = 'message-content';
        
        const maxLength = 40;
        const isLong = notification.mensaje.length > maxLength;
        messageEl.textContent = isLong 
            ? notification.mensaje.substring(0, maxLength) + '...' 
            : notification.mensaje;
        
        // Mensaje completo (oculto inicialmente)
        const fullMessageEl = document.createElement('div');
        fullMessageEl.className = 'full-message';
        fullMessageEl.textContent = notification.mensaje;
        fullMessageEl.style.display = 'none';
        
        // Fecha
        const dateEl = document.createElement('div');
        dateEl.className = 'date';
        dateEl.textContent = formatDate(notification.fecha_notificacion);
        
        // Botón Ver más/menos
        const expandBtn = document.createElement('div');
        expandBtn.className = 'expand-btn';
        
        if (isLong) {
            expandBtn.textContent = 'Ver más';
            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (fullMessageEl.style.display === 'none') {
                    // Expandir
                    fullMessageEl.style.display = 'block';
                    messageEl.style.display = 'none';
                    expandBtn.textContent = 'Ver menos';
                    div.classList.add('expanded');
                } else {
                    // Contraer
                    fullMessageEl.style.display = 'none';
                    messageEl.style.display = 'block';
                    expandBtn.textContent = 'Ver más';
                    div.classList.remove('expanded');
                }
            });
        }

        contentWrapper.appendChild(titleEl);
        contentWrapper.appendChild(messageEl);
        contentWrapper.appendChild(fullMessageEl);
        div.appendChild(contentWrapper);
        div.appendChild(dateEl);
        if (isLong) div.appendChild(expandBtn);
        
        return div;
    }

    // Limpiar notificaciones de la bandeja (marcar como hidden)
    document.getElementById('clearBtn')?.addEventListener('click', () => {
        const stored = getStoredNotifications();
        stored.forEach(notification => {
            notification.hidden = true;
        });
        localStorage.setItem('notifications', JSON.stringify(stored));
        renderNotifications();
        updateBadge();
    });

    // Formatear fecha
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

    fetchNotifications();
});