import { useEffect, useRef, useState, useCallback } from 'react'
import { Icon } from '@iconify/react'
import '../styles/window.css'
import { windowContents } from '../data/windowContents'

import { useWindowDraggable } from '../hooks/useWindowDraggable'
import { useWindowZIndex } from '../hooks/useWindowZIndex'
import { useWindowVisibility } from '../hooks/useWindowVisibility'
import { useWindowMaximize } from '../hooks/useWindowMaximize'
import { useWindowResizable } from '../hooks/useWindowResizable'

export default function AppWindow({
  id,
  title,
  isTop,
  onWindowClick,
  onWindowClose,
  onWindowToggle,
  isToggled,
  setAlert
}) {
  // #region Window Config
  const winRef = useRef(null)
  const dragRef = useRef(null)
  const screen = document.querySelector('.screen')
  const [windowPosition, setWindowPosition] = useState({ x: '50%', y: '50%' })
  const [windowSize, setWindowSize] = useState({ width: 900, height: 532 })
  const topBarHeight = 35.2

  // Maximiza o restaura la ventana
  const { isMaximized, toggleMaximize } = useWindowMaximize(winRef, dragRef, windowPosition, windowSize)
  // Configurar la ventana para arrastrar
  useWindowDraggable(winRef, dragRef, screen, topBarHeight, setWindowPosition)
  // Manejador de zIndex
  useWindowZIndex(winRef, isMaximized, isTop, id)
  // Minimiza la ventane o restaura
  useWindowVisibility(winRef, isToggled)
  useWindowResizable(winRef, screen, isMaximized, setWindowSize, setWindowPosition, topBarHeight)
  // #endregion

  // #region Window Content
  const [activeView, setActiveView] = useState()
  const [searchedElement, setSearchedElement] = useState(null)
  const content = windowContents[id]
  const sidebarLabelRefs = useRef([])

  useEffect(() => {
    if (content?.sidebar?.length > 0) {
      setActiveView(content.sidebar[0].key)
    }
  }, [id])

  const setSidebarRef = (el, index) => {
    sidebarLabelRefs.current[index] = el
  }

  const hideSideBar = useCallback((event) => {
    if (event.ctrlKey && event.key === "b") {
      event.preventDefault()
      sidebarLabelRefs.current.forEach(label => {
        if (label) {
          label.style.display = label.style.display === "none" ? "inline" : "none"
        }
      })
    }
  }, [])

  useEffect(() => {
    if (!isTop) return

    document.addEventListener("keydown", hideSideBar)
    return () => document.removeEventListener("keydown", hideSideBar)
  }, [isTop, hideSideBar])

  const renderSidebarContent = useCallback(() => {
    if (!content?.sidebar) return null

    return (
      <ul className='window__menu'>
        {content.sidebar.map((item, index) => (
          <li
            key={item.key}
            onClick={() => setActiveView(item.key)}
            className={`window__menu--item ${activeView === item.key ? 'window__menu--item--active' : ''}`}>
            <Icon
              icon={item.icon}
              width='28px'
              strokeWidth={1.2}
              className='window__menu--item--icon' />
            <span ref={el => setSidebarRef(el, index)}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    )
  }, [content?.sidebar, activeView])

  const renderMainContent = useCallback(() => {
    if (!content?.views) return null
    const ViewComponent = content.views?.[activeView]

    if (!ViewComponent) return null

    const props = { setAlert }

    switch (activeView) {
      case 'listElement':
        props.setActiveView = setActiveView
        props.setSearchedElement = setSearchedElement
        break
      case 'seeElement':
        props.searchElement = searchedElement
    }

    return <ViewComponent {...props} />
  }, [content?.views, activeView, setAlert, searchedElement])

  // #endregion

  return (
    <section
      ref={winRef}
      className='window'
      id={id}
      onClick={() => onWindowClick(id)}
    >
      <div className='draggable' ref={dragRef} />

      <header className='window-btns'>
        <button
          type='button'
          onClick={() => onWindowClose(id)}
          className='window__btn window__btn--close'
        />
        <button
          type='button'
          onClick={() => onWindowToggle(id)}
          className='window__btn window__btn--minimize'
        />
        <button
          type='button'
          onClick={toggleMaximize}
          className='window__btn window__btn--maximize'
        />
      </header>

      <aside className='window__sidebar'>
        {renderSidebarContent()}
      </aside>

      <main className='window__main'>
        <header className='window-main__header'>
          <span>{title}</span>
        </header>
        <article className='window-main__article'>
          {renderMainContent()}
        </article>
      </main>
    </section>
  )
}