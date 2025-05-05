import { useEffect, useState } from 'react'
import { FetchElementsEndpoint } from '../../config/apiRoutes'

/**
 * Hook para manejar la busqueda de todos los elementos disponibles
 *
 * @param {Function} setAlert - Función para mostrar alertas.
 *
 * @returns {Object} - Objeto con el estado de los elementos encontrados, y la funcion para actualizarlo.
 */
export const useFetchElements = (setAlert) => {
  // Estados para manejar los elementos a mostrar, el elemento a deshabilitar y el estado del modal
  const [elements, setElements] = useState([])

  // Realiza una petición para obtener los elementos de la API
  useEffect(() => {
    fetch(FetchElementsEndpoint)
      .then((res) => res.json())
      .then((response) => {
        // Establece el estado de los elementos con la respuesta de la API
        setElements(response)
      })
      .catch((error) => {
        // En caso de que ocurra un error en la petición, o un error en el servidor, se captura y se muestra un mensaje de error
        console.error(error)
        setAlert({ type: 'error', message: 'Error al cargar los elementos', active: true })
      })
  }, [])

  return {
    elements,
    setElements
  }
}
