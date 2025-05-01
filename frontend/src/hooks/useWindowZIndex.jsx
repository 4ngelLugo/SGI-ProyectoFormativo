import { useEffect } from 'react'

/**
 * Hook que controla el valor de zIndex de una ventana, cambiando su valor dependiendo
 * si está maximizada y si está en la parte superior de otras ventanas.
 * 
 * @param {React.RefObject} winRef - Referencia a la ventana cuyo zIndex se debe ajustar.
 * @param {boolean} isMaximized - Estado que indica si la ventana está maximizada.
 * @param {boolean} isTop - Estado que indica si la ventana está en la parte superior.
 * @param {string} id - Identificador único de la ventana para comparar con `isTop`.
 */
export const useWindowZIndex = (winRef, isMaximized, isTop, id) => {
  useEffect(() => {
    //Verifica que la referencia de la ventana no sea nula antes de aplicar estilos
    if (!winRef.current) return

    //Asignar el zIndex dependiendo del estado de maximización y si está en la parte superior
    if (isMaximized) {
      winRef.current.style.zIndex = '100'
    } else if (isTop === id) {
      winRef.current.style.zIndex = '20'
    } else {
      winRef.current.style.zIndex = '10'
    }

  }, [isTop, isMaximized, id, winRef])
}
