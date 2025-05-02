import { useEffect } from 'react'
import danger from '../assets/icons/danger.svg'
import success from '../assets/icons/success.svg'

export default function Alert ({ alertRef, type, message, active, setAlert }) {
  useEffect(() => {
    // Si el elemento de la alerta no existe, no se ejecuta el efecto
    if (!alertRef.current) return

    // Si la alerta esta activa configura un temporizador para ocultarla después de 5 segundos
    if (active) {
      const timeout = setTimeout(() => {
        // Restablece el estado de la alerta a su valor inicial
        setAlert({ type: '', message: '', active: false })
      }, 5000)

      // Limpia el temporizador cuando el componente se desmonte o cuando la alerta se desactive
      return () => clearTimeout(timeout)
    }
  }, [active, setAlert])

  // Determina el icono a mostrar según el tipo de alerta ( error o success )
  const icon = type === 'error' ? danger : type === 'success' ? success : ''

  return (
    <div ref={alertRef} className={`alert ${active ? `alert--active ${type}` : ''}`}>
      {icon && <img src={icon} alt={type} width='64px' />}
      <span>{message}</span>
    </div>
  )
}
