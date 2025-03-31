import { useEffect, useRef } from 'react'

export const useWindowResizable = (winRef, screen, isMaximized, setSize, setPosition, topBarHeight) => {
  const resizingRef = useRef(null)

  useEffect(() => {
    if (!winRef.current || !screen || isMaximized) return

    const windowRef = winRef.current
    const resizers = ['top', 'right', 'bottom', 'left']

    const minWindowWidth = 700
    const minWindowHeight = 400

    const handleMouseDown = (direction, e) => {
      e.preventDefault()

      resizingRef.current = { direction, startX: e.clientX, startY: e.clientY }

      const windowRect = windowRef.getBoundingClientRect()
      const screenRect = screen.getBoundingClientRect()
      resizingRef.current = {
        ...resizingRef.current,
        startWidth: windowRect.width,
        startHeight: windowRect.height,
        startLeft: windowRect.left,
        startTop: windowRect.top,
        screenRect
      }

      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (e) => {
      if (!resizingRef.current || !windowRef) return

      const { direction, startX, startY, startWidth, startHeight, startLeft, startTop, screenRect } = resizingRef.current

      const differenceX = e.clientX - startX
      const differenceY = e.clientY - startY

      if (direction === 'right') {
        const newWidth = Math.min(Math.max(minWindowWidth, startWidth + differenceX), screenRect.right - startLeft)
        windowRef.style.width = `${newWidth}px`
      }

      if (direction === 'left') {
        let newWidth = startWidth - differenceX
        let newLeft = startLeft + differenceX

        if (newWidth < minWindowWidth) {
          newWidth = minWindowWidth
          newLeft = startLeft + (startWidth - minWindowWidth)
        }

        if (newLeft < screenRect.left) {
          newLeft = screenRect.left
          newWidth = startLeft + startWidth - screenRect.left
        }

        windowRef.style.width = `${newWidth}px`
        windowRef.style.left = `${newLeft}px`
      }

      if (direction === 'bottom') {
        const newHeight = Math.min(Math.max(minWindowHeight, startHeight + differenceY), screenRect.bottom - startTop)
        windowRef.style.height = `${newHeight}px`
      }

      if (direction === 'top') {
        let newHeight = startHeight - differenceY
        let newTop = startTop + differenceY - topBarHeight

        if (newHeight < minWindowHeight) {
          newHeight = minWindowHeight
          newTop = startTop + (startHeight - minWindowHeight) - topBarHeight
        }

        if (newTop < screenRect.top - topBarHeight) {
          newTop = screenRect.top - topBarHeight
          newHeight = startTop + startHeight - (screenRect.top)
        }

        windowRef.style.height = `${newHeight}px`
        windowRef.style.top = `${newTop}px`
      }
    }

    const handleMouseUp = () => {
      if (!windowRef) return

      setSize({
        width: windowRef.getBoundingClientRect().width,
        height: windowRef.getBoundingClientRect().height
      })
      setPosition({
        x: windowRef.getBoundingClientRect().left,
        y: windowRef.getBoundingClientRect().top
      })

      resizingRef.current = null
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    resizers.forEach((direction) => {
      const resizer = document.createElement('div')
      resizer.classList.add('resizer', `resizer--${direction}`)
      windowRef.appendChild(resizer)
      resizer.addEventListener('mousedown', (e) => handleMouseDown(direction, e))
    })

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
