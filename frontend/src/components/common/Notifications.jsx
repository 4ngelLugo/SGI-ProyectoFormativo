import React, { useState, useEffect } from 'react'
import ConfirmModal from './ConfirmModal'
import danger from '../../assets/icons/danger.svg'
import '../../styles/notifications.css'
import { Icon } from '@iconify/react'

export default function NotificationCenter({ rolId = 1, setIsAuthenticated}) {
  const [notifications, setNotifications] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    syncNotificationsFromDB()
  }, [])

  const handleLogOff = () => {
    localStorage.setItem('isAuthenticated', JSON.stringify(false))
    localStorage.removeItem('user')
    setIsAuthenticated(false)
  }

  // Función para obtener notificaciones del localStorage
  const getLocalStorageNotifications = () => {
    const stored = localStorage.getItem(`notifications_${rolId}`)
    return stored ? JSON.parse(stored) : []
  }

  // Función para guardar notificaciones en localStorage
  const saveNotificationsToLocalStorage = (notifications) => {
    localStorage.setItem(`notifications_${rolId}`, JSON.stringify(notifications))
  }

  // Función para cargar notificaciones desde localStorage
  const loadNotificationsFromLocalStorage = () => {
    const storedNotifications = getLocalStorageNotifications()
    setNotifications(storedNotifications)
  }

  // Función para sincronizar con BD y actualizar localStorage
  const syncNotificationsFromDB = () => {
    fetch('http://localhost/SGI-ProyectoFormativo/backend/notificaciones/api/obtenerNotificaciones.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rol_id: rolId })
    })
      .then(res => res.json())
      .then(data => {
        const dbNotifications = data.notifications || []
        const localNotifications = getLocalStorageNotifications()
        
        // Crear un mapa de las notificaciones locales existentes por ID
        const localNotificationMap = new Map(
          localNotifications.map(n => [n.id, n])
        )
        
        // Agregar solo las nuevas notificaciones de la BD
        const updatedNotifications = [...localNotifications]
        
        dbNotifications.forEach(dbNotification => {
          if (!localNotificationMap.has(dbNotification.id)) {
            updatedNotifications.unshift(dbNotification) // Agregar al principio
          }
        })
        
        // Guardar en localStorage y actualizar estado
        saveNotificationsToLocalStorage(updatedNotifications)
        setNotifications(updatedNotifications)
      })
      .catch(err => {
        console.error('Error al sincronizar notificaciones:', err)
        // En caso de error, cargar desde localStorage
        loadNotificationsFromLocalStorage()
      })
  }

  const toggleTray = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      // Al abrir, primero cargar desde localStorage y luego sincronizar
      loadNotificationsFromLocalStorage()
      syncNotificationsFromDB()
    }
  }

  // Función para eliminar una notificación específica
  const deleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(n => n.id !== notificationId)
    saveNotificationsToLocalStorage(updatedNotifications)
    setNotifications(updatedNotifications)
  }

  // Función para limpiar todas las notificaciones
  const clearAllNotifications = () => {
    saveNotificationsToLocalStorage([])
    setNotifications([])
  }

  // Función para marcar notificación como leída
  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, leida: true } : n
    )
    saveNotificationsToLocalStorage(updatedNotifications)
    setNotifications(updatedNotifications)
  }

  return (
    <>
      <div className="top-bar">
        <div className="notification-icon" onClick={toggleTray}>
          <Icon icon='fa-solid:bell' style={{ color: 'white', fontSize: '20px' }} />
          {notifications.length > 0 && (
            <span className="notification-badge">
              {notifications.length > 9 ? '9+' : notifications.length}
            </span>
          )}
        </div>
      </div>

      <div className={`windows-notification-center ${isOpen ? 'open' : ''}`}>
        <div className="notification-header">
          <span>Notificaciones</span>
          {notifications.length > 0 && (
            <button 
              className="clear-all-btn"
              onClick={clearAllNotifications}
              title="Limpiar todas las notificaciones"
            >
              <Icon icon='fa-solid:trash' style={{ fontSize: '14px' }} />
            </button>
          )}
        </div>

        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="no-notifications">
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

        <div className="separator"></div>

        <div className="shutdown-icon" title="Cerrar sesión" onClick={() => setShowModal(true)}>
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

      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  )
}

function NotificationItem({ data, onDelete, onMarkAsRead }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = data.mensaje.length > 40
  const isRead = data.leida

  return (
    <div 
      className={`notification tipo-${data.tipo_notificacion.toLowerCase()} ${isRead ? 'read' : 'unread'}`}
      onClick={() => !isRead && onMarkAsRead()}
    >
      <div className="notification-actions">
        <button 
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          title="Eliminar notificación"
        >
          <Icon icon='fa-solid:times' style={{ fontSize: '12px' }} />
        </button>
      </div>
      
      <div className="type-label">{data.tipo_notificacion}</div>
      <div className="message-content">
        {expanded || !isLong ? data.mensaje : `${data.mensaje.slice(0, 40)}...`}
      </div>
      <div className="date">{formatDate(data.fecha_notificacion)}</div>
      {isLong && !expanded && (
        <div
          className="expand-btn"
          onClick={(e) => {
            e.stopPropagation()
            setExpanded(true)
          }}
        >
          Ver más
        </div>
      )}
    </div>
  )
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}