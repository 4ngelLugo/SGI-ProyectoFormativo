import { useEffect, useRef } from 'react'

/**
 * Hook para hacer que una ventana sea redimensionable, permitiendo cambiar su tamaño mediante manipuladores ubicados en los bordes y esquinas. También actualiza el tamaño y la posición de la ventana en función de las interacciones del usuario.
 * 
 * @param {React.RefObject} winRef - Referencia a la ventana que se desea redimensionar.
 * @param {HTMLElement} screen - Elemento de la pantalla o contenedor donde se mueve la ventana.
 * @param {boolean} isMaximized - Bandera que indica si la ventana está maximizada.
 * @param {Function} setSize - Función para actualizar el tamaño de la ventana en el estado.
 * @param {Function} setPosition - Función para actualizar la posición de la ventana en el estado.
 * @param {number} topBarHeight - Altura de la barra superior de la ventana (para ajustar el redimensionado superior).
 */
export const useWindowResizable = (winRef, screen, isMaximized, setSize, setPosition, topBarHeight) => {
  //Referencia para manejar el proceso de redimensionado
  const resizingRef = useRef(null)

  useEffect(() => {
    //Si no hay referencia a la ventana, no hay pantalla o la ventana esta maximizada, no se hace nada
    if (!winRef.current || !screen || isMaximized) return

    const windowRef = winRef.current
    const resizers = [
      'top', 'right', 'bottom', 'left',
      'top-left', 'top-right', 'bottom-left', 'bottom-right'
    ]

    //Definición del tamaño minimo de la ventana
    const minWindowWidth = 700
    const minWindowHeight = 400

    //Función para manejar cuando el usuario hace clic en un manipulador de redimensionado
    const handleMouseDown = (direction, e) => {
      e.preventDefault()

      //Guardar la posición inicial del mouse y el tamaño de la ventana
      const startX = e.clientX
      const startY = e.clientY
      const windowRect = windowRef.getBoundingClientRect()
      const screenRect = screen.getBoundingClientRect()

      resizingRef.current = {
        direction,
        startX,
        startY,
        startWidth: windowRect.width,
        startHeight: windowRect.height,
        startLeft: windowRect.left,
        startTop: windowRect.top,
        screenRect
      }

      //Añade los eventos de movimiento 'mousemove' y liberación del mouse 'mouseup
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    //Función para manejar el tamaño de la ventana mientras el usuario mueve el mouse
    const handleMouseMove = (e) => {
      if (!resizingRef.current) return

      //Desestructuración de la referencia de redimensionado
      const {
        direction,
        startX,
        startY,
        startWidth,
        startHeight,
        startLeft,
        startTop,
        screenRect
      } = resizingRef.current

      //Calcular la diferencia de movimiento del mouse en el eje X y Y
      const differenceX = e.clientX - startX
      const differenceY = e.clientY - startY

      let newWidth = startWidth
      let newHeight = startHeight
      let newLeft = startLeft
      let newTop = startTop

      //Ajustar el tamaño de la ventana según la dirección del manipulador de redimensionado
      if (direction.includes('right')) {
        newWidth = Math.min(Math.max(minWindowWidth, startWidth + differenceX), screenRect.right - startLeft)
      }
      if (direction.includes('left')) {
        newWidth = startWidth - differenceX
        newLeft = startLeft + differenceX

        //Asegurar que el nuevo ancho no sea menor al mínimo
        if (newWidth < minWindowWidth) {
          newWidth = minWindowWidth
          newLeft = startLeft + (startWidth - minWindowWidth)
        }
        //Asegurar que la ventana no se desplace fuera de la pantalla
        if (newLeft < screenRect.left) {
          newLeft = screenRect.left
          newWidth = startLeft + startWidth - screenRect.left
        }
      }

      if (direction.includes('bottom')) {
        newHeight = Math.min(Math.max(minWindowHeight, startHeight + differenceY), screenRect.bottom - startTop)
      }
      if (direction.includes('top')) {
        newHeight = startHeight - differenceY
        newTop = startTop + differenceY - topBarHeight

        //Asegurar que la altura no sea menor al mínimo
        if (newHeight < minWindowHeight) {
          newHeight = minWindowHeight
          newTop = startTop + (startHeight - minWindowHeight) - topBarHeight
        }
        //Asegurar que la ventana no se desplace fuera de la pantalla
        if (newTop < screenRect.top - topBarHeight) {
          newTop = screenRect.top - topBarHeight
          newHeight = startTop + startHeight - screenRect.top
        }
      }

      //Aplicar el nuevo tamaño y posición a la ventana
      windowRef.style.width = `${newWidth}px`
      windowRef.style.height = `${newHeight}px`

      if (direction.includes('left')) {
        windowRef.style.left = `${newLeft}px`
      }
      if (direction.includes('top')) {
        windowRef.style.top = `${newTop}px`
      }
    }

    //Función para manejar cuando el usuario libera el mouse
    const handleMouseUp = () => {
      if (!winRef.current) return

      //Obtener el tamaño y posición final de la ventana
      const rect = windowRef.getBoundingClientRect()
      setSize({ width: rect.width, height: rect.height })
      setPosition({ x: rect.left, y: rect.top })

      resizingRef.current = null
      //Eleminar los eventos de movimiento y liberación del mouse
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    //Crear y agregar los manipuladores de redimensionado a la ventana
    resizers.forEach((direction) => {
      const resizer = document.createElement('div')
      resizer.classList.add('resizer', `resizer--${direction}`)
      windowRef.appendChild(resizer)
      resizer.addEventListener('mousedown', (e) => handleMouseDown(direction, e))
    })

    //Eliminar los controladores de redimensionado cuando el componente se desmonta
    return () => {
      resizers.forEach((direction) => {
        const resizer = windowRef.querySelector(`.resizer--${direction}`)
        if (resizer) {
          resizer.removeEventListener('mousedown', handleMouseDown)
          resizer.remove()
        }
      })
    }
  }, [winRef, screen, isMaximized, setSize, setPosition, topBarHeight])
}
