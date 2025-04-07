import { useEffect } from "react"
import danger from '../assets/icons/danger.svg'
import success from '../assets/icons/success.svg'

export default function Alert({ alertRef, type, message, active, setAlert }) {

  useEffect(() => {
    if (!alertRef.current) return

    if (active) {
      const timeout = setTimeout(() => {
        setAlert({ type: '', message: '', active: false })
      }, 5000)

      return () => clearTimeout(timeout)
    }
  }, [active, type])

  const icon = type === 'error' ? danger : type === 'success' ? success : ''

  return (
    <div ref={alertRef} className={`alert ${active ? `alert--active ${type}` : ''}`}>
      {icon && <img src={icon} alt={type} width='64px' />}
      <span>{message}</span>
    </div>
  )
}
