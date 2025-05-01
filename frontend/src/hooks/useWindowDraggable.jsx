import { useEffect } from 'react'

/**
 * Hook que permite hacer que una ventana sea arrastrable dentro de la pantalla.
 * Permite mover la ventana dentro de los límites de la pantalla, 
 * asegurando que no salga de los bordes.
 * 
 * @param {React.RefObject} winRef - Referencia a la ventana que se quiere mover.
 * @param {React.RefObject} dragRef - Referencia al área que será la zona de arrastre.
 * @param {HTMLElement} screen - Elemento que representa la pantalla o contenedor donde la ventana puede moverse.
 * @param {number} tobBarHeight - Altura de la barra superior de la ventana.
 * @param {Function} setWindowPosition - Función para actualizar la posición de la ventana.
 */
export const useWindowDraggable = (winRef, dragRef, screen, tobBarHeight, setWindowPosition) => {
  useEffect(() => {
    const draggableRef = dragRef.current
    const windowRef = winRef.current

    //Si no hay referencias a la ventana o al área de arrastre, no hacer nada
    if (!draggableRef || !windowRef || !screen) return

    let isDragging = false
    let offsetX, offsetY

    //Función que inicia el arrastre cuando el usuario hace click en la zona de arrastre
    const mouseDown = (e) => {
      isDragging = true

      // Calcula el dezplazamiento relativo del mouse con respecto a la ventana
      offsetX = e.clientX - windowRef.getBoundingClientRect().left
      offsetY = e.clientY - windowRef.getBoundingClientRect().top + tobBarHeight
      windowRef.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
    }

    //Función para mover la ventana mientras el usuario arrastra el mouse
    const mouseMove = (e) => {
      if (!isDragging) return
      e.preventDefault()

      //Obtiene las dimensiones y posición actual de la ventana y la pantalla
      const windowRect = windowRef.getBoundingClientRect()
      const screenRect = screen.getBoundingClientRect()

      //Calcula la nueva posición de la pantalla
      let newX = e.clientX - offsetX
      let newY = e.clientY - offsetY

      // Limita la posición de la ventana dentro de la pantalla
      newX = Math.max(screenRect.left, Math.min(newX, screenRect.right - windowRect.width))
      newY = Math.max((screenRect.top - tobBarHeight), Math.min(newY, (screenRect.bottom - windowRect.height) - tobBarHeight))

      //Pasa la nueva posición de la ventana al estado del componente
      setWindowPosition({ x: newX, y: newY })

      //Aplica la transformación CSS para mover la ventana
      windowRef.style.transform = 'none'
      windowRef.style.top = `${newY}px`
      windowRef.style.left = `${newX}px`
    }

    const mouseUp = () => {
      isDragging = false
      windowRef.style.cursor = ''
      document.body.style.userSelect = ''
    }

    //Manejadores de eventos para el mouse
    draggableRef.addEventListener('mousedown', mouseDown)
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp)

    //Cleanup: Elimina los event listeners cuando el componente se desmonta
    return () => {
      draggableRef.removeEventListener('mousedown', mouseDown)
      document.removeEventListener('mousemove', mouseMove)
      document.removeEventListener('mouseup', mouseUp)
    }
  }, [])
}
