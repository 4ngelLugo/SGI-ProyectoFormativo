import { useEffect, useRef, useState, useCallback } from 'react'
import { useWindowDraggable, useWindowZIndex, useWindowVisibility, useWindowMaximize, useWindowResizable } from '../../hooks'
import { windowContents } from '../../constants/windowContents'
import '../../styles/window.css'
import { Icon } from '@iconify/react'

/**
 * Componente para una ventana interactiva, que incluye la capacidad de maximizar, minimizar, cambiar el tamaño, y mostrar diferentes vistas y contenidos
 *
 * @param {string} id - Identificador único de la ventana.
 * @param {string} title - Titulo de la ventana.
 * @param {boolean} isTop - Indica si la ventana es la ventana activa.
 * @param {function} onWindowClick - Función que se ejecuta al hacer clic en la ventana.
 * @param {function} onWindowClose - Función que se ejecuta al cerrar la ventana.
 * @param {function} onWindowToggle - Función que se ejecuta al minimizar/restaurar la ventana.
 * @param {boolean} isToggled - Indica si la ventana esta minimizada o no.
 * @param {function} setAlert - Función para mostrar alertas.
*/

export default function AppWindow ({
  id,
  title,
  isTop,
  onWindowClick,
  onWindowClose,
  onWindowToggle,
  isToggled,
  setAlert,
  permisos
}) {
  // #region Configuración de la ventana
  // Estados de la ultima posición y tamaño de la ventana. Se inicializan con valores por defecto
  const [windowSize, setWindowSize] = useState({ width: 900, height: 532 })
  const [windowPosition, setWindowPosition] = useState({ x: '50%', y: '50%' })

  // Objeto HTML del escritorio y referencias a la ventana y su elemento arrastrable
  const winRef = useRef(null)
  const dragRef = useRef(null)
  const screen = document.querySelector('.screen')

  // Altura de la barra superior del escritorio, usada en cálculos de posicion y tamaño de la ventana
  const topBarHeight = 35.2

  // Estado de maximizado de la ventana y función para alternar entre maximizado y restaurado
  const { isMaximized, toggleMaximize } = useWindowMaximize(winRef, dragRef, windowPosition, windowSize, setWindowSize)
  // Configuración de la ventana para permitir el arrastre
  useWindowDraggable(winRef, dragRef, screen, topBarHeight, setWindowPosition)
  // Manejador de zIndex de la ventana
  useWindowZIndex(winRef, isMaximized, isTop, id)
  // Minimiza la ventana o la restaura
  useWindowVisibility(winRef, isToggled)
  // Manejador de eventos para el cambio de tamaño de la ventana
  useWindowResizable(winRef, screen, isMaximized, setWindowSize, setWindowPosition, topBarHeight)
  // #endregion

  // #region Contenido de la ventana
  // Estado para manejar el contenido de la ventana, según la paestaña del menú lateral seleccionada
  const [activeView, setActiveView] = useState()

  // Array de referencias para las pestañas del menú lateral
  const sidebarLabelRefs = useRef([])
  // Contenido de la ventana, obtenido de un objeto de datos según el ID de la ventana
  const content = windowContents[id]

  // Función para establecer la referencia de cada pestaña del menú lateral
  const setSidebarRef = (el, index) => {
    sidebarLabelRefs.current[index] = el
  }

  // Estados especificos para cada ventana
  const [searchedItem, setSearchedItem] = useState(null)
  const [searchedEdit, setSearchedEdit] = useState(null)

  // Función para renderizar el contenido del menú lateral, según lo establecido para cada ventana
  // Se utiliza useCallback para evitar la recreación de la función en cada renderizado
  const renderSidebarContent = useCallback(() => {
    if (!content?.sidebar) return null

    const labelToPermisoMap = {
      listar: 'listar',
      crear: 'registrar',
      buscar: 'listar',
      editar: 'modificar',
      cargar: 'cargar',
      examinar: 'examinar',
      descargar: 'descargar',
      realizar: 'realizar'
    }

    const normalizar = texto =>
      typeof texto === 'string'
        ? texto
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
        : ''

    const filteredLabels = content?.sidebar
      .filter(item => {
        if (id === 'estadisticas' || id === 'roles') return item

        const labelNorm = normalizar(item.label) // ej: "buscar elemento"
        const [accionLabel, ...rest] = labelNorm.split(' ')
        const entidadLabel = rest.join(' ') // ej: "elemento"
        const verboPermiso = labelToPermisoMap[accionLabel]
        if (!verboPermiso) return false

        // Permitimos tanto singular como plural
        const sing = entidadLabel
        const plur = entidadLabel.endsWith('s')
          ? entidadLabel
          : entidadLabel + 's'

        return permisos?.data?.some(p => {
          const modOk = normalizar(p.modulo) === normalizar(id)
          const permOk = normalizar(p.permiso) === `${verboPermiso} ${sing}` ||
            normalizar(p.permiso) === `${verboPermiso} ${plur}`
          return modOk && permOk
        })
      })

    // Abre la ventana mostrando automaticamente el contenido de la primera pestaña del menú lateral para el rol del usuario
    useEffect(() => {
      setActiveView(filteredLabels[0].key)
    }, [id])

    return (
      <ul className='window__menu'>
        {filteredLabels.map((item, idx) => (
          <li
            key={item.key}
            onClick={() => setActiveView(item.key)}
            className={`window__menu--item ${activeView === item.key ? 'window__menu--item--active' : ''
              }`}
          >
            <Icon
              icon={item.icon}
              width='28px'
              strokeWidth={1.2}
              className='window__menu--item--icon'
            />
            <span ref={el => setSidebarRef(el, idx)}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    )
  }, [content?.sidebar, activeView, permisos, id])

  // Función para renderizar el contenido principal de la ventana, según la pestaña del manú lateral seleccionada
  const renderMainContent = useCallback(() => {
    if (!content?.views) return null
    const ViewComponent = content.views?.[activeView]

    if (!ViewComponent) return null

    const props = { setAlert }

    if (id === 'elementos') {
      switch (activeView) {
        case 'listElement':
          props.windowHeight = windowSize.height
          props.isMaximized = isMaximized
          props.setActiveView = setActiveView
          props.setSearchedItem = setSearchedItem
          props.setSearchedEdit = setSearchedEdit
          props.permisos = permisos
          break
        case 'createElement':
          props.setActiveView = setActiveView
          break
        case 'searchElement':
          props.searchedItem = searchedItem
          props.setSearchedItem = setSearchedItem
          break
        case 'editElement':
          props.searchedEdit = searchedEdit
          props.setActiveView = setActiveView
          break
      }
    }

    if (id === 'usuarios') {
      switch (activeView) {
        case 'listarUsuarios':
          props.windowHeight = windowSize.height
          props.isMaximized = isMaximized
          props.setActiveView = setActiveView
          props.setSearchedItem = setSearchedItem
          props.setSearchedEdit = setSearchedEdit
          props.permisos = permisos
          break
        case 'crearUsuario':
          props.setActiveView = setActiveView
          break
        case 'buscarUsuario':
          props.searchedItem = searchedItem
          props.setSearchedItem = setSearchedItem
          break
        case 'editarUsuario':
          props.searchedEdit = searchedEdit
          props.setActiveView = setActiveView
          break
      }
    }

    if (id === 'prestamos') {
      switch (activeView) {
        case 'listarPrestamos':
          props.windowHeight = windowSize.height
          props.isMaximized = isMaximized
          props.setActiveView = setActiveView
          props.setSearchedItem = setSearchedItem
          props.setSearchedEdit = setSearchedEdit
          props.permisos = permisos
          break
        case 'crearPrestamo':
          props.setActiveView = setActiveView
          break
        case 'buscarPrestamo':
          props.searchedItem = searchedItem
          props.setSearchedItem = setSearchedItem
          break
        case 'editarPrestamo':
          props.searchedEdit = searchedEdit
          props.setActiveView = setActiveView
          break
      }
    }

    if (id === 'roles') {
      switch (activeView) {
        case 'listarRoles':
          props.windowHeight = windowSize.height
          props.isMaximized = isMaximized
          props.setActiveView = setActiveView
          props.setSearchedItem = setSearchedItem
          props.setSearchedEdit = setSearchedEdit
          break
        case 'crearRol':
          props.setActiveView = setActiveView
          break
        case 'buscarRol':
          props.searchedItem = searchedItem
          props.setSearchedItem = setSearchedItem
          break
        case 'editarRol':
          props.searchedEdit = searchedEdit
          props.setActiveView = setActiveView
          break
      }
    }

    if (id === 'configuración') {
      props.windowHeight = windowSize.height
      props.isMaximized = isMaximized
      props.permisos = permisos
    }

    return <ViewComponent {...props} />
  }, [content?.views, activeView, setAlert, searchedItem, windowSize, isMaximized])

  // #endregion

  // Función para ocultar los textos en el menú lateral al presionar Ctrl + B
  const [manuallyHideLabels, setManuallyHideLabels] = useState(false)

  const hideSideBar = useCallback((event) => {
    if (event.ctrlKey && event.key.toLowerCase() === 'b') {
      event.preventDefault()
      sidebarLabelRefs.current.forEach(label => {
        if (label.style.display === 'inline') {
          setManuallyHideLabels(true)
          label.style.display = 'none'
        } else {
          setManuallyHideLabels(false)
          label.style.display = 'inline'
        }
      })
    }
  }, [])

  // Añade el manejador para el evento 'keydown' mientras la ventana este activa
  useEffect(() => {
    if (!isTop) return

    document.addEventListener('keydown', hideSideBar)
    return () => document.removeEventListener('keydown', hideSideBar)
  }, [isTop, hideSideBar])

  // Si la ventana tiene cierto ancho, oculta los textos del menú lateral
  useEffect(() => {
    if (windowSize.width <= 700) {
      sidebarLabelRefs.current.forEach(label => {
        label.style.display = 'none'
      })
    } else if (windowSize.width > 700 && !manuallyHideLabels) {
      sidebarLabelRefs.current.forEach(label => {
        label.style.display = 'inline'
      })
    }
  }, [windowSize])

  const capitalizarPrimeraLetra = (texto) => {
    if (!texto) return ''
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
  }

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
          <span>{capitalizarPrimeraLetra(title)}</span>
        </header>
        <article className='window-main__article'>
          {renderMainContent()}
        </article>
      </main>
    </section>
  )
}
