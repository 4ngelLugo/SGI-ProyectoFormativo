/* global localStorage */
import { useState, useEffect, useRef } from 'react';
import ConfirmModal from './ConfirmModal';
import danger from '../../assets/icons/danger.svg';
import '../../styles/notifications.css';
import { Icon } from '@iconify/react';

export default function NotificationCenter({ rolId = 1, setIsAuthenticated }) {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const syncInProgressRef = useRef(false); 

  // Obtener el rol del usuario del localStorage
  const getUserRole = () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return rolId; 
      const user = JSON.parse(userData);
      return user.rol || rolId; 
    } catch (e) {
      console.error('Error al obtener rol del usuario:', e);
      return rolId; 
    }
  };

  const currentUserRole = getUserRole();

  // Función para normalizar IDs de notificación
  const normalizeId = (noti) => {
    const id = noti.notification_id || noti.notificacion_id || noti.id_notification || noti.id;
    return id;
  };

  // Obtener todas las notificaciones del localStorage
  const getAllNotifications = () => {
    try {
      const stored = localStorage.getItem(`notifications_${currentUserRole}`);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      
      return parsed
        .filter(noti => noti.rol_id === currentUserRole) 
        .map(noti => {
          const normalizedId = normalizeId(noti);
          const result = {
            id: String(normalizedId),
            rol_id: noti.rol_id,
            tipo_notificacion: noti.tipo_notificacion,
            mensaje: noti.mensaje,
            fecha_notificacion: noti.fecha_notificacion,
            hidden: noti.hidden || false,
            titulo: noti.titulo || '',
            leida: noti.leida || false
          };
          return result;
        });
    } catch (e) {
      console.error('Error al leer notificaciones:', e);
      return [];
    }
  };

  // Obtener solo notificaciones visibles
  const getVisibleNotifications = () => {
    return getAllNotifications().filter(n => !n.hidden);
  };

  // Guardar notificaciones en localStorage
  const saveNotifications = (notifications) => {
    localStorage.setItem(`notifications_${currentUserRole}`, JSON.stringify(notifications));
  };

  // Sincronizar con la base de datos
  const syncNotificationsFromDB = async () => {
    // Prevenir múltiples llamadas simultáneas
    if (syncInProgressRef.current) {
      return;
    }

    syncInProgressRef.current = true;

    try {
      const response = await fetch('http://localhost/SGI-ProyectoFormativo/backend/notificaciones/api/obtenerNotificaciones.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rol_id: currentUserRole })
      });

      const data = await response.json();
      const dbNotifications = (data.notifications || [])
        .filter(noti => noti.rol_id === currentUserRole); 
      
      const currentAllNotifications = getAllNotifications();
      const existingIds = new Set(currentAllNotifications.map(n => String(n.id)));
      
      const newNotifications = dbNotifications.filter(dbNoti => {
        const dbId = String(normalizeId(dbNoti)); 
        const exists = existingIds.has(dbId);
        
        return !exists;
      });

      if (newNotifications.length > 0) {
        const notificationsToAdd = newNotifications.map(dbNoti => ({
          id: String(normalizeId(dbNoti)), 
          rol_id: dbNoti.rol_id,
          tipo_notificacion: dbNoti.tipo_notificacion,
          mensaje: dbNoti.mensaje,
          fecha_notificacion: dbNoti.fecha_notificacion,
          hidden: false, 
          titulo: dbNoti.titulo || '',
          leida: false
        }));

        const updatedAllNotifications = [...currentAllNotifications, ...notificationsToAdd];
       
        saveNotifications(updatedAllNotifications);
        setNotifications(updatedAllNotifications.filter(n => !n.hidden));
      } else {
        const visibleNotifications = getVisibleNotifications();
        setNotifications(visibleNotifications);
      }
    } catch (err) {
      console.error('Error al sincronizar notificaciones:', err);

      setNotifications(getVisibleNotifications());
    } finally {
      syncInProgressRef.current = false;
    }
  };

  // Cargar notificaciones iniciales y sincronizar
  useEffect(() => {
    const visibleNotifications = getVisibleNotifications();
    setNotifications(visibleNotifications);

    const timeoutId = setTimeout(() => {
      syncNotificationsFromDB();
    }, 100);

    return () => clearTimeout(timeoutId); 
  }, [currentUserRole]); 

  // Marcar notificación como oculta
  const deleteNotification = (notificationId) => {
    if (!notificationId) {
      console.error('ID de notificación es undefined o null');
      return;
    }

    const currentAllNotifications = getAllNotifications();
    const stringId = String(notificationId);
    const updatedNotifications = currentAllNotifications.map(n => {
      const match = String(n.id) === stringId;
      return match ? { ...n, hidden: true } : n;
    });
    
    // Guardar todas las notificaciones
    saveNotifications(updatedNotifications);
    
    // Actualizar estado solo con las visibles
    setNotifications(updatedNotifications.filter(n => !n.hidden));
  };

  // Marcar todas como ocultas
  const clearAllNotifications = () => {
    const currentAllNotifications = getAllNotifications();
    const updatedNotifications = currentAllNotifications.map(n => ({ ...n, hidden: true }));
    
    // Guardar todas como ocultas
    saveNotifications(updatedNotifications);
    
    setNotifications([]);
  };

  const markAsRead = (notificationId) => {
    const currentAllNotifications = getAllNotifications();
    const stringId = String(notificationId); 
    const updatedNotifications = currentAllNotifications.map(n =>
      String(n.id) === stringId ? { ...n, leida: true } : n
    );
    
    // Guardar todas las notificaciones con el estado actualizado
    saveNotifications(updatedNotifications);
    
    // Actualizar estado solo con las visibles
    setNotifications(updatedNotifications.filter(n => !n.hidden));
  };

  const toggleTray = () => {
    setIsOpen(!isOpen);
    
    if (!isOpen) {
      syncNotificationsFromDB();
    }
  };

  const handleLogOff = () => {
    localStorage.setItem('isAuthenticated', JSON.stringify(false));
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <>
      <div className='top-bar'>
        <div className='notification-icon' onClick={toggleTray}>
          <Icon icon='fa-solid:bell' style={{ color: 'white', fontSize: '20px' }} />
          {notifications.filter(n => !n.leida).length > 0 && (
            <span className='notification-badge'>
              {notifications.filter(n => !n.leida).length > 9 ? '9+' : notifications.filter(n => !n.leida).length}
            </span>
          )}
        </div>
      </div>

      <div className={`windows-notification-center ${isOpen ? 'open' : ''}`}>
        <div className='notification-header'>
          <span>Notificaciones</span>
          {notifications.length > 0 && (
            <button
              className='clear-all-btn'
              onClick={clearAllNotifications}
              title='Limpiar todas las notificaciones'
            >
              <Icon icon='fa-solid:trash' style={{ fontSize: '14px' }} />
            </button>
          )}
        </div>

        <div className='notification-list'>
          {notifications.length === 0 ? (
            <div className='no-notifications'>
              <Icon icon='fa-solid:bell-slash' style={{ fontSize: '32px', color: '#666' }} />
              <p>No hay notificaciones</p>
            </div>
          ) : (
            notifications.map((n, i) => (
              <NotificationItem
                key={n.id || i}
                data={n}
                onDelete={() => deleteNotification(n.id)}
                onMarkAsRead={() => markAsRead(n.id)}
              />
            ))
          )}
        </div>

        <div className='separator' />

        <div className='shutdown-icon' title='Cerrar sesión' onClick={() => setShowModal(true)}>
          <Icon icon='fa-solid:power-off' style={{ fontSize: '20px' }} />
        </div>
      </div>

      <ConfirmModal
        icon={danger}
        title='¿Está seguro que desea cerrar sesión?'
        showModal={showModal}
        setShowModal={setShowModal}
        action={handleLogOff}
      />

      {isOpen && <div className='overlay' onClick={() => setIsOpen(false)} />}
    </>
  );
}

function NotificationItem({ data, onDelete, onMarkAsRead }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = data.mensaje.length > 100; // Aumenté el límite para que sea más útil
  const isRead = data.leida;
  const hasTitle = data.titulo && data.titulo.trim() !== '';

  const displayMessage = isLong && !expanded 
    ? data.mensaje.substring(0, 100) + '...' 
    : data.mensaje;

  return (
    <div
      className={`notification tipo-${data.tipo_notificacion.toLowerCase()} ${isRead ? 'read' : 'unread'}`}
      onClick={() => !isRead && onMarkAsRead()}
      style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
    >
      <div className='notification-actions'>
        <button
          className='delete-btn'
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title='Eliminar notificación'
        >
          <Icon icon='fa-solid:times' style={{ fontSize: '12px' }} />
        </button>
      </div>

      <div className='type-label'>{data.tipo_notificacion}</div>

      {hasTitle && (
        <div className='notification-title'>{data.titulo}</div>
      )}

      <div 
        className='message-content'
        style={{ 
          wordBreak: 'break-word', 
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          maxWidth: '100%'
        }}
      >
        {displayMessage}
      </div>
      
      {isLong && (
        <div
          className='expand-btn'
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? 'Ver menos' : 'Ver más'}
        </div>
      )}
      
      <div className='date'>{formatDate(data.fecha_notificacion)}</div>
    </div>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}