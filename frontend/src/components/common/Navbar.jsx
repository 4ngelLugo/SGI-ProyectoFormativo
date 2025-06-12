import appleLogo from '../../assets/images/macIcon.webp'

export default function Navbar ({ windowOnTop }) {
  // Función que capitaliza la primera letra de la palabra y convierte el resto a minúsculas
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  // Define el nombre que se mostrará en la barra (ventana activa o nombre por defecto)
  const formattedWindowOnTop = windowOnTop ? capitalizeFirstLetter(windowOnTop) : 'SENA'

  return (
    <nav className='topBar'>
      <div className='topBar--fileOptions'>
        <img src={appleLogo} alt='Logo' />

        <span><strong>{formattedWindowOnTop}</strong></span>
      </div>
    </nav>
  )
}
