import { useEffect, useState } from 'react'
import { FetchElementByCodeEndpoint } from '../../config/apiRoutes'

/**
 * Hook para manejar la busqueda de un elemento por su codigo
 *
 * @param {Function} setAlert - Función para mostrar alertas.
 * @param {string} codeToSearch - Codigo del elemento a buscar.
 *
 * @returns {Object} - Objeto con el estado de carga, escritura y el elemento encontrado.
 */
export const useFetchElementByCode = ({ setAlert, codeToSearch }) => {
  // Estado para guardar si la pagina esta guardando está cargando
  // Estado para guardar si el usuario está escribiendo
  // Estado para guardar el código de búsqueda
  // Estado para almacenar los datos del elemento
  const [loading, setLoading] = useState(false)
  const [typing, setTyping] = useState(false)
  const [element, setElement] = useState(null)

  // Función para buscar un elemento por su codigo, haciendo una petición a la API
  const fetchElement = async (code) => {
    try {
      const res = await fetch(`${FetchElementByCodeEndpoint}${code}`)
      const response = await res.json()

      // Si la respuesta tiene error, se muestra una alerta y se limpia el estado del elemento
      if (response.error) {
        setAlert({ type: 'error', message: response.error })
        setElement(null)
      } else {
        setElement(response)
      }
    } catch (error) {
      // Si ocurre un error en la solicitud, se muestra una alerta de error
      setAlert({ type: 'error', message: 'Ocurrio un error en la petición', active: true })
      setElement(null)
      setTyping(false)
    }
  }

  // Efecto para manejar la búsqueda del elemento al escribir en el input
  useEffect(() => {
    // Si el codigo de búsqueda esta vacio, se limpia el estado del elemento y se detiene la carga
    if (!codeToSearch) {
      setElement(null)
      setLoading(false)
      setTyping(false)
      return
    }

    // Marca que se está escribiendo y comienza a cargar
    setTyping(true)
    setLoading(true)

    // Configura un temporizador de 0.7 segundos para evitar llamadas a la API innecesarias mientras el usuario escribe
    const timer = setTimeout(async () => {
      setTyping(false)
      await fetchElement(codeToSearch)
      setLoading(false)
    }, 700)

    // Limpia el temporizador si el componente se desmonta o si el código de búsqueda cambia
    return () => clearTimeout(timer)
  }, [codeToSearch])

  return {
    loading,
    typing,
    element,
    setElement,
    setLoading
  }
}
