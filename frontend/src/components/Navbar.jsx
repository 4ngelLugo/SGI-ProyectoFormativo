import appleLogo from '../assets/images/macIcon.webp'

export default function Navbar({ windowOnTop }) {
  const options = ['Archivo', 'Editar', 'Ver', 'Ir', 'Ventana', 'Ayuda']

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }
  const formattedWindowOnTop = windowOnTop ? capitalizeFirstLetter(windowOnTop) : 'SENA'

  return (
    <nav className='topBar'>
      <div className='topBar--fileOptions'>
        <img src={appleLogo} alt='' />

        <span><strong>{formattedWindowOnTop}</strong></span>
        {
          options.map(option => (
            <span key={option}>{option}</span>
          ))
        }
      </div>
    </nav>
  )
}
