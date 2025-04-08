import { useRef, useState } from 'react'
import { useWindowDraggable } from '../hooks/useWindowDraggable'
import { useWindowZIndex } from '../hooks/useWindowZIndex'
import { useWindowVisibility } from '../hooks/useWindowVisibility'
import { useWindowMaximize } from '../hooks/useWindowMaximize'
import { useWindowResizable } from '../hooks/useWindowResizable'
import DataTable from './DataTable'

import '../styles/window.css'

export default function AppWindow ({
  id,
  title,
  isTop,
  onWindowClick,
  onWindowClose,
  onWindowToggle,
  isToggled,
  windowType
}) {
  const winRef = useRef(null)
  const dragRef = useRef(null)
  const screen = document.querySelector('.screen')

  const [windowPosition, setWindowPosition] = useState({ x: '50%', y: '50%' })
  const [windowSize, setWindowSize] = useState({ width: 700, height: 400 })
  const topBarHeight = 35.2

  // Sample data for the table - in a real app, you'd fetch this or pass it as props
  const [tableData, setTableData] = useState([
    { id: 1, name: 'Item 1', category: 'Category A', price: 100 },
    { id: 2, name: 'Item 2', category: 'Category B', price: 200 },
    { id: 3, name: 'Item 3', category: 'Category A', price: 150 },
    { id: 4, name: 'Item 4', category: 'Category C', price: 300 },
    { id: 5, name: 'Item 5', category: 'Category B', price: 250 },
  ])

  const tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price' },
  ]

  // Maximiza o restaura la ventana
  const { isMaximized, toggleMaximize } = useWindowMaximize(winRef, dragRef, windowPosition, windowSize)

  // Configurar la ventana para arrastrar
  useWindowDraggable(winRef, dragRef, screen, topBarHeight, setWindowPosition)

  // Manejador de zIndex
  useWindowZIndex(winRef, isMaximized, isTop, id)

  // Minimiza la ventane o restaura
  useWindowVisibility(winRef, isToggled)

  useWindowResizable(winRef, screen, isMaximized, setWindowSize, setWindowPosition, topBarHeight)

  // Render different content based on windowType
  const renderWindowContent = () => {
    switch (windowType) {
      case 'dataTable':
        return <DataTable data={tableData} columns={tableColumns} />
      case 'settings':
        return <div className="window-content">Settings content here</div>
      default:
        return (
          <div className="window-content">
            <p>Default window content</p>
          </div>
        )
    }
  }

  

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

      <article className='window__article'>
        <header className='window-article__header'>
          <span>{title}</span>
        </header>
        <div className="window-article__content">
          {renderWindowContent()}
        </div>
      </article>
    </section>
  )
}
