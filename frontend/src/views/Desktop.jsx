import { useRef, useState } from 'react'
import Navbar from '../components/common/Navbar'
import RocketDock from '../components/layout/RocketDock'
import AppWindow from '../components/layout/AppWindow'
import Alert from '../components/common/Alert'
import ContextMenu from '../components/common/ContextMenu'
import '../styles/desktop.css'

export default function Desktop () {
  // Estado array con los IDs de las ventanas abiertas y su estado (visible o minimizada)
  // Estado de la ventana que está al frente (ventana abierta o en la que se hizo clic más recientemente)
  // Estado con la alerta (tipo, mensaje y visibilidad)
  const [openWindows, setOpenWindows] = useState([])
  const [isTop, setIsTop] = useState()
  const [alert, setAlert] = useState({ type: '', message: '', active: false })

  // Referencia a la alerta
  const alertRef = useRef(null)

  // Abre una ventana al hacer clic en uno de los iconos del RocketDock y la lleva al frente
  const onIconClick = (name) => {
    setOpenWindows((prev) => {
      // Si la ventana ya está abierta pero minimizada, la restaura
      const existingWindow = prev.find((window) => window.id === name)

      if (existingWindow) {
        return prev.map((window) =>
          window.id === name ? { ...window, isToggled: true } : window
        )
      }

      // Si no, abre una nueva instancia de la ventana
      return [...prev, { id: name, isToggled: true }]
    })

    setIsTop(name)
  }

  // Lleva la ventana seleccionada hacia el frente
  const onWindowClick = (id) => {
    setIsTop(id)
  }

  // Cierra la ventana, eliminándola de la lista de ventanas abiertas
  // Actualiza la ventana activa si corresponde
  const onWindowClose = (id) => {
    setOpenWindows((prev) => {
      const updatedWindows = prev.filter((window) => window.id !== id)

      // Si la ventana cerrada era la que estaba al frente
      if (isTop === id) {
        // Si hay más ventanas abiertas, ponemos al frente la última abierta
        setIsTop(updatedWindows.length > 0 ? updatedWindows[updatedWindows.length - 1].id : null)
      }

      return updatedWindows
    })
  }

  // Minimiza la ventana
  const onWindowToggle = (id) => {
    setOpenWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, isToggled: !window.isToggled } : window
      )
    )
  }

  // IDs de las ventanas abiertas para enviar al RocketDock y cambiar el estilo de los iconos
  const windowIds = openWindows.map((window) => window.id)

  const mainScreen = useRef(null)

  return (
    <main className='mainScreen' ref={mainScreen}>
      <Navbar windowOnTop={isTop} />
      <ContextMenu mainScreen={mainScreen.current} />
      <div className='screen'>
        {/* Mapeo de las ventanas abiertas, si la ventana está minimizada no se renderiza */}
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
        <RocketDock onIconClick={onIconClick} openWindows={windowIds} />
        <Alert
          alertRef={alertRef}
          type={alert.type}
          message={alert.message}
          active={alert.active}
          setAlert={setAlert}
        />
      </div>
    </main>
  )
}
