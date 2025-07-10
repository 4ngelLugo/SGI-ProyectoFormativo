import { useEffect, useState } from 'react'
import { FetchElementByCodeEndpoint, ObtenerUsuarioPorCodigoEndpoint, ObtenerCategoriaPorCodigoEndpoint, ObtenerRolPorIDEndpoint, ObtenerAreaPorCodigoEndpoint, ObtenerTipoDocumentoPorCodigoEndpoint, ObtenerPrestamoPorCodigoEndpoint, ObtenerPermisosPorRolEndpoint } from '../../config/apiRoutes'
import { MESSAGES } from '../../constants/messages'
/**
 * Hook para manejar la busqueda de un elemento por su codigo
 *
 * @param {Function} setAlert - Función para mostrar alertas.
 * @param {string} codeToSearch - Codigo del elemento a buscar.
 *
 * @returns {Object} - Objeto con el estado de carga, escritura y el elemento encontrado.
 */
export const useFetchByCode = ({ setAlert, codeToSearch, obtener }) => {
  const endpoints = {
    elemento: FetchElementByCodeEndpoint,
    usuario: ObtenerUsuarioPorCodigoEndpoint,
    rol: ObtenerRolPorIDEndpoint,
    permisosUsuario: ObtenerPermisosPorRolEndpoint,
    area: ObtenerAreaPorCodigoEndpoint,
    categoria: ObtenerCategoriaPorCodigoEndpoint,
    tipoDocumento: ObtenerTipoDocumentoPorCodigoEndpoint,
    prestamo: ObtenerPrestamoPorCodigoEndpoint
  }

  const apiEndpoint = endpoints[obtener]

  if (!apiEndpoint) {
    console.warn(`Tipo '${obtener}' no es válido para búsqueda`)
    return
  }

  // Estado para guardar si la pagina está cargando
  // Estado para almacenar los datos del elemento
  const [loading, setLoading] = useState(false)
  const [element, setElement] = useState(null)

  // Función para buscar un elemento por su codigo, haciendo una petición a la API
  const fetchElement = async (code) => {
    if (!apiEndpoint) {
      setAlert({
        type: 'error',
        message: 'Tipo de operación inválido',
        active: true
      })
      return
    }

    try {
      const res = await fetch(`${apiEndpoint}${code}`)

      const response = await res.json()

      // Si la respuesta tiene error, se muestra una alerta y se limpia el estado del elemento
      if (response.error) {
        setAlert({
          type: 'error',
          message: MESSAGES[obtener][response.error] || 'Error desconocido',
          active: true
        })
        setElement(null)

        return false
      } else {
        setElement(response)

        return true
      }

      // En caso de que ocurra un error en la petición, o un error en el servidor, se captura y se muestra un mensaje de error
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Ocurrió un error en la petición',
        active: true
      })
      setElement(null)
    }
  }

  // Efecto para manejar la búsqueda del elemento al escribir en el input
  useEffect(() => {
    // Si el codigo de búsqueda esta vacio, se limpia el estado del elemento y se detiene la carga
    if (!codeToSearch) {
      setElement(null)
      setLoading(false)
      return
    }

    // Comienza a cargar
    setLoading(true)

    // Configura un temporizador de 0.5 segundos para evitar llamadas a la API innecesarias
    const timer = setTimeout(async () => {
      await fetchElement(codeToSearch)
      setLoading(false)
    }, 500)

    // Limpia el temporizador si el componente se desmonta o si el código de búsqueda cambia
    return () => clearTimeout(timer)
  }, [codeToSearch])

  return {
    loading,
    element,
    setElement,
    setLoading
  }
}
