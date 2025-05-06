import { useEffect, useRef, useState } from 'react'

export default function ContextMenu({ mainScreen }) {
  const [menuState, setMenuState] = useState(false)
  const contextMenuRef = useRef(null)

  useEffect(() => {
    if (!mainScreen) return

    const handleRightClick = (event) => {
      event.preventDefault()

      const menu = contextMenuRef.current

      setMenuState(true)

      const mouseX = event.clientX
      const mouseY = event.clientY

      if (menu) {
        menu.style.top = `${mouseY}px`
        menu.style.left = `${mouseX}px`
      }
    }

    const handleLeftClick = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setMenuState(false)
      }
    }

    mainScreen.addEventListener('contextmenu', handleRightClick)
    mainScreen.addEventListener('click', handleLeftClick)

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
