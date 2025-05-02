import { useEffect } from 'react'

/**
 * Hook que controla la visibilidad de una ventana, alternando entre visible y minimizada
 * según el estado de `isToggled`. Además, agrega animaciones de minimización y restauración.
 *
 * @param {React.RefObject} winRef - Referencia a la ventana que se desea mostrar u ocultar.
 * @param {boolean} isToggled - Estado que indica si la ventana debe estar visible (true) o minimizada (false).
 */
export const useWindowVisibility = (winRef, isToggled) => {
  useEffect(() => {
    if (!winRef.current) return

    // Si la ventana está visible (no minimizada)
    if (isToggled) {
      winRef.current.style.display = ''
      winRef.current.classList.add('isRestoring')

      // Eliminar la clase después de un pequeño retraso (para la animación)
      const timer = setTimeout(() => {
        winRef.current.classList.remove('isRestoring')
      }, 200)

      // Limpiar el timeout cuando el componente se desmonta o el estado cambia
      return () => clearTimeout(timer)
    } else {
      winRef.current.classList.add('isMinimizing') // Agregar clase de animación de minimización

      // Después de un retraso, ocultar la ventana
      const timer = setTimeout(() => {
        winRef.current.style.display = 'none' // Establecer el display en 'none' para ocultar
        winRef.current.classList.remove('isMinimizing') // Eliminar clase de minimización
      }, 300)

      // Limpiar el timeout cuando el componente se desmonta o el estado cambia
      return () => clearTimeout(timer)
    }
  }, [isToggled, winRef])
}
