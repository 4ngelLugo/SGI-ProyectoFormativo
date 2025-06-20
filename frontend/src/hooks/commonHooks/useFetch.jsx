import { useEffect, useRef, useState } from 'react'
import { FetchElementsEndpoint, ObtenerUsuariosEndpoint, ObtenerRolesEndpoint, ObtenerPermisosEndpoint, ObtenerAreasEndpoint, ObtenerCategoriasEndpoint, ObtenerMarcasEndpoint, ObtenerTipoDocumentoEndpoint, ObtenerPrestamosEndpoint } from '../../config/apiRoutes'

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
    prestamos: ObtenerPrestamosEndpoint
  }

  const apiEndpoint = endpoints[obtener]

  if (!apiEndpoint) {
    console.warn(`Tipo '${obtener}' no es válido para búsqueda`)
    return
  }

  const initialLimit = windowHeight ? calculateInitialLimit(windowHeight, isMaximized) : 100

  // Estados para manejar los elementos a mostrar, el elemento a deshabilitar y el estado del modal
  const [elements, setElements] = useState([])
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(null)
  const [limit, setLimit] = useState(initialLimit)

  const screen = document.querySelector('.screen')
  const screenRect = screen.getBoundingClientRect()

  const prevHeight = useRef(isMaximized ? Math.floor((screenRect.height - 86) / 52) : Math.floor((windowHeight - 86) / 52))

  useEffect(() => {
    if (page > maxPage && maxPage !== null) setPage(maxPage)
  }, [page, maxPage])

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
  const fetchElements = (apiEndpoint) => {
    fetch(apiEndpoint)
      .then((res) => res.json())
      .then((response) => {
        const offset = (page - 1) * limit
        setMaxPage(Math.ceil(response.length / limit))

        // Establece el estado de los elementos con la respuesta de la API
        if (response.length > 0) setElements(response.slice(offset, offset + limit))
        else setElements(response)
      })
      .catch(error => {
        // En caso de que ocurra un error en la petición, o un error en el servidor, se captura y se muestra un mensaje de error
        console.error(error)
        setAlert({ type: 'error', message: 'Error al cargar los elementos', active: true })
      })
  }

  // Realiza la petición para obtener los elementos de la API
  useEffect(() => {
    fetchElements(apiEndpoint)
  }, [page, limit, apiEndpoint])

  return {
    elements,
    setElements,
    page,
    setPage,
    maxPage,
    fetchElements
  }
}
