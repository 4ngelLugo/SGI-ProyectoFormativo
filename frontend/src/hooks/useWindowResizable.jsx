import { useEffect, useRef } from 'react'

export const useWindowResizable = (winRef, screen, isMaximized, setSize, setPosition, topBarHeight) => {
  const resizingRef = useRef(null)

  useEffect(() => {
    if (!winRef.current || !screen || isMaximized) return

    const windowRef = winRef.current
    const resizers = [
      'top', 'right', 'bottom', 'left',
      'top-left', 'top-right', 'bottom-left', 'bottom-right'
    ]

    const minWindowWidth = 700
    const minWindowHeight = 400

    const handleMouseDown = (direction, e) => {
      e.preventDefault()
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

      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (e) => {
      if (!resizingRef.current) return

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

      const differenceX = e.clientX - startX
      const differenceY = e.clientY - startY

      let newWidth = startWidth
      let newHeight = startHeight
      let newLeft = startLeft
      let newTop = startTop

      if (direction.includes('right')) {
        newWidth = Math.min(Math.max(minWindowWidth, startWidth + differenceX), screenRect.right - startLeft)}
      if (direction.includes('left')) {
        newWidth = startWidth - differenceX
        newLeft = startLeft + differenceX

        if (newWidth < minWindowWidth) {
          newWidth = minWindowWidth
          newLeft = startLeft + (startWidth - minWindowWidth)
        }

        if (newLeft < screenRect.left) {
          newLeft = screenRect.left
          newWidth = startLeft + startWidth - screenRect.left
        }
      }

      if (direction.includes('bottom')) {
        newHeight = Math.min(Math.max(minWindowHeight, startHeight + differenceY),screenRect.bottom - startTop)
      }
      if (direction.includes('top')) {
        newHeight = startHeight - differenceY
        newTop = startTop + differenceY - topBarHeight

        if (newHeight < minWindowHeight) {
          newHeight = minWindowHeight
          newTop = startTop + (startHeight - minWindowHeight) - topBarHeight
        }
        if (newTop < screenRect.top - topBarHeight) {
          newTop = screenRect.top - topBarHeight
          newHeight = startTop + startHeight - screenRect.top
        }
      }

      windowRef.style.width = `${newWidth}px`
      windowRef.style.height = `${newHeight}px`

      if (direction.includes('left')) {
        windowRef.style.left = `${newLeft}px`
      }
      if (direction.includes('top')) {
        windowRef.style.top = `${newTop}px`
      }
    }

    const handleMouseUp = () => {
      if (!winRef.current) return

      const rect = windowRef.getBoundingClientRect()
      setSize({ width: rect.width, height: rect.height })
      setPosition({ x: rect.left, y: rect.top })

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
