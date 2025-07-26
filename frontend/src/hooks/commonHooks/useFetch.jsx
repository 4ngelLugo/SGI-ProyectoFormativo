import { useEffect, useRef, useState } from 'react'
import { FetchElementsEndpoint, ObtenerUsuariosEndpoint, ObtenerRolesEndpoint, ObtenerPermisosEndpoint, ObtenerAreasEndpoint, ObtenerCategoriasEndpoint, ObtenerMarcasEndpoint, ObtenerTipoDocumentoEndpoint, ObtenerPrestamosEndpoint, CuentaElementosPrestados, CuentaPrestamosUsuario, ObtenerSolicitantesEndpoint } from '../../config/apiRoutes'
import { MESSAGES } from '../../constants/messages'
/**
 * Calcula el límite inicial de elementos según el alto de pantalla.
 *
 * @param {number} windowHeight - Altura de la ventana.
 * @param {boolean} isMaximized - Estado de maximización.
 * @returns {number}
 */
const calculateInitialLimit = (windowHeight, isMaximized) => {
  const screen = document.querySelector('.screen')
  if (!screen) return 5

  const screenRect = screen.getBoundingClientRect()
  const baseHeight = isMaximized ? screenRect.height : windowHeight
  return Math.floor((baseHeight - 86) / 52) - 3
}

/**
 * Hook para manejar la busqueda de todos los elementos disponibles
 *
 * @param {Function} setAlert - Función para mostrar alertas.
 * @param {Integer} windowHeight - Altura de la ventana
 * @param {Boolean} isMaximized - Estado de maximización de la ventana.
 * @param {String} obtener - Tipo de elemento a crear.
 * @returns {Object} - Objeto con el estado de los elementos encontrados, y la funcion para actualizarlo.
 */
export const useFetch = ({ setAlert, windowHeight, isMaximized, obtener }) => {
  const endpoints = {
    elementos: FetchElementsEndpoint,
    usuarios: ObtenerUsuariosEndpoint,
    roles: ObtenerRolesEndpoint,
    permisos: ObtenerPermisosEndpoint,
    areas: ObtenerAreasEndpoint,
    categorias: ObtenerCategoriasEndpoint,
    marcas: ObtenerMarcasEndpoint,
    tipoDocumento: ObtenerTipoDocumentoEndpoint,
    prestamos: ObtenerPrestamosEndpoint,
    elementosPrestados: CuentaElementosPrestados,
    prestamosUsuarios: CuentaPrestamosUsuario,
    solicitantes: ObtenerSolicitantesEndpoint
  }

  const apiEndpoint = endpoints[obtener]

  if (!apiEndpoint) {
    console.warn(`Tipo '${obtener}' no es válido para búsqueda`)
    return
  }

  const initialLimit = windowHeight ? calculateInitialLimit(windowHeight, isMaximized) : 100

  // Estados para manejar los elementos a mostrar, el elemento a deshabilitar y el estado del modal
  const [elements, setElements] = useState([])
  const [allElements, setAllElements] = useState([])
  const [filteredElements, setFilteredElements] = useState(undefined)
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(null)
  const [limit, setLimit] = useState(initialLimit)

  const screen = document.querySelector('.screen')
  const screenRect = screen?.getBoundingClientRect()

  // Calcula el espacio para filas segun el tamaño de las ventanas y si estan maximizadas o no
  const prevHeight = useRef(isMaximized ? Math.floor((screenRect.height - 86) / 52) : Math.floor((windowHeight - 86) / 52))

  // Si la pagina actual es mayor a la pagina maxima, establece la pagina actual igual a la maxima
  useEffect(() => {
    if (page > maxPage && maxPage !== null) setPage(maxPage)
  }, [page, maxPage])

  // Efecto para calcular el limite de filas en las tablas según la altura de las ventanas
  useEffect(() => {
    if (!windowHeight) return

    let currentHeigh

    if (isMaximized && screen) {
      currentHeigh = Math.floor((screenRect.height - 86) / 52)
    } else {
      currentHeigh = Math.floor((windowHeight - 86) / 52)
    }

    if (currentHeigh > prevHeight.current) {
      const difference = currentHeigh - prevHeight.current
      setLimit(prev => Math.floor(prev + difference))
      prevHeight.current = currentHeigh
    } else if (currentHeigh < prevHeight.current) {
      const difference = prevHeight.current - currentHeigh
      setLimit(prev => Math.floor(prev - difference) > 1 ? Math.floor(prev - difference) : 1)
      prevHeight.current = currentHeigh
    }
  }, [windowHeight, isMaximized, elements])

  // Función reutilizable para una petición fetch
  const fetchElements = async (apiEndpoint) => {
    if (!apiEndpoint) {
      setAlert({
        type: 'error',
        message: 'Tipo de operación inválido',
        active: true
      })
      return
    }

    try {
      const res = await fetch(apiEndpoint)

      const response = await res.json()

      if (response.error) {
        setAlert({
          type: 'error',
          message: MESSAGES[obtener][response.error] || 'Error desconocido',
          active: true
        })
        return false
      }

      if (response.success) {
        const data = response.data

        const activeElements = Array.isArray(data)
          ? data.filter(el => {
            const estado = el.estado?.toLowerCase()
            return estado !== 'deshabilitado' &&
              estado !== 'inhabilitado' &&
              estado !== 'inactivo' &&
              estado !== 'desactivado'
          })
          : []

        setAllElements(data)

        const dataToPage = filteredElements || activeElements
        const offset = (page - 1) * limit
        setMaxPage(Math.ceil(dataToPage.length / limit))
        setElements(dataToPage.slice(offset, offset + limit))

        return true
      }

      // En caso de que ocurra un error en la petición, o un error en el servidor, se captura y se muestra un mensaje de error
    } catch (error) {
      console.error(error)
      setAlert({
        type: 'error',
        message: 'Ocurrió un error en la petición',
        active: true
      })
      return false
    }
  }

  // Realiza la petición para obtener los elementos de la API
  useEffect(() => {
    fetchElements(apiEndpoint)
  }, [page, limit, apiEndpoint])

  return {
    elements,
    setElements,
    allElements,
    filteredElements,
    setFilteredElements,
    page,
    setPage,
    maxPage,
    setMaxPage,
    fetchElements
  }
}
