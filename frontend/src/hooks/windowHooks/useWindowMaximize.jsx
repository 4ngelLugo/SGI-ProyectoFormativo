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
export const useWindowMaximize = (winRef, dragRef, windowPosition, windowSize, setWindowSize) => {
  // Estado que indica si la ventana está maximizada
  const [isMaximized, setIsMaximized] = useState()
  const [size, setSize] = useState({ width: windowSize.width, height: windowSize.height })

  useEffect(() => {
    if (isMaximized) return

    setSize({ width: windowSize.width, height: windowSize.height })
  }, [windowSize])

  // Alterna el estado de maximización de la ventana
  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  useEffect(() => {
    if (!winRef.current || !dragRef.current) return

    const window = winRef.current

    if (isMaximized) {
      window.classList.add('maximized_window')
      window.style.top = ''
      window.style.left = ''
      window.style.width = ''
      window.style.height = ''

      const windowRect = window.getBoundingClientRect()
      setWindowSize({
        width: windowRect.width,
        height: windowRect.height
      })
    } else {
      window.classList.remove('maximized_window')
      window.style.top = `${windowPosition.y}px`
      window.style.left = `${windowPosition.x}px`
      window.style.width = `${size.width}px`
      window.style.height = `${size.height}px`

      setWindowSize({
        width: size.width,
        height: size.height
      })
    }

    // Ocultar o mostrar la barra de arrastre dependiendo del estado de maximización
    dragRef.current.style.display = isMaximized ? 'none' : ''
  }, [isMaximized])

  return { isMaximized, toggleMaximize }
}
