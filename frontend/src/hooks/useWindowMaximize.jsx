import { useEffect, useState } from 'react'

/**
 * Hook para manejar el estado de maximización de una ventana.
 * Permite alternar entre maximizada y restaurada, ajustando su tamaño y posición.
 * 
 * @param {React.RefObject} winRef - Referencia a la ventana que se maximiza/restaura.
 * @param {React.RefObject} dragRef - Referencia a la barra de arrastre de la ventana.
 * @param {{x: number, y: number}} windowPosition - Posición actual de la ventana.
 * @param {{width: number, height: number}} windowSize - Tamaño actual de la ventana.
 * 
 * @returns {Object} - Objeto con el estado de maximización y la función para alternarlo.
 */
export const useWindowMaximize = (winRef, dragRef, windowPosition, windowSize) => {
  //Estado que indica si la ventana está maximizada
  const [isMaximized, setIsMaximized] = useState()

  //Alterna el estado de maximización de la ventana
  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  useEffect(() => {
    if (!winRef.current || !dragRef.current) return

    if (isMaximized) {
      winRef.current.classList.add('maximized_window')
      winRef.current.style.top = ''
      winRef.current.style.left = ''
      winRef.current.style.width = ''
      winRef.current.style.height = ''
    } else {
      winRef.current.classList.remove('maximized_window')
      winRef.current.style.top = `${windowPosition.y}px`
      winRef.current.style.left = `${windowPosition.x}px`
      winRef.current.style.width = `${windowSize.width}px`
      winRef.current.style.height = `${windowSize.height}px`
    }

    //Ocultar o mostrar la barra de arrastre dependiendo del estado de maximización
    dragRef.current.style.display = isMaximized ? 'none' : ''
  }, [isMaximized])

  return { isMaximized, toggleMaximize }
}
