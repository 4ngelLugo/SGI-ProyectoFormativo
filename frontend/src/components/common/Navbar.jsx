/* global localStorage */
import NotificationCenter from './Notifications'
import logo from '../../assets/images/logo.svg'

export default function Navbar ({ windowOnTop, setIsAuthenticated }) {
  // Función que capitaliza la primera letra de la palabra y convierte el resto a minúsculas
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  // Define el nombre que se mostrará en la barra (ventana activa o nombre por defecto)
  const formattedWindowOnTop = windowOnTop ? capitalizeFirstLetter(windowOnTop) : 'LENDORA'

  return (
    <>
      <nav className='topBar'>
        <div className='topBar--fileOptions'>
          <img src={logo} alt='Logo Lendora' />

          <span><strong>{formattedWindowOnTop}</strong></span>
        </div>

        <div className='topBar--right'>
          <NotificationCenter rolId={1} setIsAuthenticated={setIsAuthenticated} />
        </div>
      </nav>

    </>
  )
}
