import { useCallback, useEffect, useRef, useState } from 'react'

export default function ContextMenu({ mainScreen }) {
  //Estado que maneja la visibilidad del menú contextual
  const [menuState, setMenuState] = useState(false)

  //Referencia al menú contextual
  const contextMenuRef = useRef(null)

  //Función que maneja el evento de clic derecho
  const handleRightClick = useCallback((event) => {
    event.preventDefault()

    const menu = contextMenuRef.current

    //Actualiza el estado para mostrar el menú
    setMenuState(true)

    const mouseX = event.clientX
    const mouseY = event.clientY

    //Establece la pasición del menú en el lugar del clic derecho
    if (menu) {
      menu.style.top = `${mouseY}px`
      menu.style.left = `${mouseX}px`
    }
  }, [])

  //Función que maneja el evento de clic izquierdo
  const handleLeftClick = useCallback((event) => {
    //Si se hace clic fuera del menú, lo cierra
    if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
      setMenuState(false)
    }
  }, [])

  useEffect(() => {
    //Asegura que la referencia de la pantalla esté disponible
    if (!mainScreen) return

    //Añade el manejador de evento para 'contextmenu' (clic derecho) y 'click' (clic izquierdo)
    mainScreen.addEventListener('contextmenu', handleRightClick)
    mainScreen.addEventListener('click', handleLeftClick)

    //Elimina los event listeners cuando el componente se desmonte
    return () => {
      mainScreen.removeEventListener('contextmenu', handleRightClick)
      mainScreen.removeEventListener('click', handleLeftClick)
    }
  }, [mainScreen])

  return (
    <div
      className='contextMenu'
      style={{ display: menuState ? 'flex' : 'none' }}
      ref={contextMenuRef}>
      <ul>
        <li>Opción 1</li>
        <li>Opción 2</li>
      </ul>
    </div>
  )
}
