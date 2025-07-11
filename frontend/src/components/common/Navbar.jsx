/* global localStorage */
import logo from '../../assets/images/logo.svg'
import cerrar from '../../assets/icons/cerrar.svg'
import ConfirmModal from './ConfirmModal'
import danger from '../../assets/icons/danger.svg'
import { useState } from 'react'

export default function Navbar ({ windowOnTop, setIsAuthenticated }) {
  // Función que capitaliza la primera letra de la palabra y convierte el resto a minúsculas
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  // Define el nombre que se mostrará en la barra (ventana activa o nombre por defecto)
  const formattedWindowOnTop = windowOnTop ? capitalizeFirstLetter(windowOnTop) : 'LENDORA'

  const [showModal, setShowModal] = useState(false)

  const handleLogOff = () => {
    localStorage.setItem('isAuthenticated', JSON.stringify(false))
    localStorage.removeItem('user')
    setIsAuthenticated(false)
  }

  return (
    <>
      <nav className='topBar'>
        <div className='topBar--fileOptions'>
          <img src={logo} alt='Logo Lendora' />

          <span><strong>{formattedWindowOnTop}</strong></span>
        </div>
        <div className='cerrar' onClick={() => setShowModal(true)}>
          <img src={cerrar} alt='icono de cerrar sesión' />
        </div>
      </nav>

      <ConfirmModal
        icon={danger}
        title='¿Está seguro que desea cerrar sesión?'
        showModal={showModal}
        setShowModal={setShowModal}
        action={handleLogOff}
      />
    </>
  )
}
