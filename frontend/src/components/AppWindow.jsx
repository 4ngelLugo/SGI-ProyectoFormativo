import { useRef, useState } from 'react'
import { useWindowDraggable } from '../hooks/useWindowDraggable'
import { useWindowZIndex } from '../hooks/useWindowZIndex'
import { useWindowVisibility } from '../hooks/useWindowVisibility'
import { useWindowMaximize } from '../hooks/useWindowMaximize'
import { useWindowResizable } from '../hooks/useWindowResizable'

import '../styles/window.css'
import CreateElementsForm from './CreateElementsForm'

export default function AppWindow ({
  id,
  title,
  isTop,
  onWindowClick,
  onWindowClose,
  onWindowToggle,
  isToggled,
  setAlert
}) {
  const winRef = useRef(null)
  const dragRef = useRef(null)
  const screen = document.querySelector('.screen')

  const [windowPosition, setWindowPosition] = useState({ x: '50%', y: '50%' })
  const [windowSize, setWindowSize] = useState({ width: 700, height: 400 })
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

  return (
    <section ref={winRef} className='window' id={id} onClick={() => onWindowClick(id)}>
      <div className='draggable' ref={dragRef} />

      <header className='window-btns'>
        <button type='button' onClick={() => onWindowClose(id)} className='window__btn window__btn--close' />
        <button type='button' onClick={() => onWindowToggle(id)} className='window__btn window__btn--minimize' />
        <button type='button' onClick={toggleMaximize} className='window__btn window__btn--maximize' />
      </header>

      <aside className='window__sidebar'>
        <ul className='window__menu'>
          <li>
            <i className='fas fa-desktop' />
            <span>Pantalla</span>
          </li>
          <li>
            <i className='fas fa-video' />
            <span>Animaciones</span>
          </li>
        </ul>
      </aside>

      <main className='window__main'>
        <header className='window-main__header'>
          <span>{title}</span>
        </header>
        <article className='window-main__article'>
          {id === 'finder' && (<CreateElementsForm setAlert={setAlert} />)}
        </article>
      </main>
    </section>
  )
}
