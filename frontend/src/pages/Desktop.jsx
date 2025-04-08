import { useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import RocketDock from '../components/RocketDock'
import '../styles/desktop.css'
import AppWindow from '../components/AppWindow'
import Alert from '../components/Alert'

export default function Desktop() {
  const [openWindows, setOpenWindows] = useState([])
  const [isTop, setIsTop] = useState()
  const [alert, setAlert] = useState({ type: '', message: '', active: false })
  const alertRef = useRef(null)

  // Abre una ventana al hacer click en un icono y la lleva al frente
  const onIconClick = (name) => {
    setOpenWindows((prev) => {
      // Si la ventana ya esta abierta pero minimizada la restaura
      const existingWindow = prev.find((window) => window.id === name)

      if (existingWindow) {
        return prev.map((window) =>
          window.id === name ? { ...window, isToggled: true } : window
        )
      }

      // Si no abre una nueva instancia de la ventana
      return [...prev, { id: name, isToggled: true }]
    })

    setIsTop(name)
  }

  // Lleva la ventana seleccionada hacia el frente
  const onWindowClick = (id) => {
    setIsTop(id)
  }

  // Cierra la ventana, eliminandola de la lista de ventanas abiertas
  const onWindowClose = (id) => {
    setOpenWindows((prev) => prev.filter((window) => window.id !== id))
  }

  // Minimiza la ventana
  const onWindowToggle = (id) => {
    setOpenWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, isToggled: !window.isToggled } : window
      )
    )
  }

  return (
    <main className='mainScreen'>
      <Navbar />
      <div className='screen'>
        {openWindows.map((window) => (
          <AppWindow
            key={window.id}
            id={window.id}
            title={window.id}
            onWindowClick={onWindowClick}
            isTop={isTop}
            onWindowClose={onWindowClose}
            onWindowToggle={() => onWindowToggle(window.id)}
            isToggled={window.isToggled}
            setAlert={setAlert}
          />
        ))}
        <RocketDock onIconClick={onIconClick} />
        <Alert
          alertRef={alertRef}
          type={alert.type}
          message={alert.message}
          active={alert.active}
          setAlert={setAlert} />
      </div>
    </main>
  )
}
