import { useState } from 'react'
import { DeactivateElementsEndPoint, DesactivarRolEndpoint, FetchElementsEndpoint, ObtenerRolesEndpoint, DesactivarUsuarioEndpoint, ObtenerUsuariosEndpoint, DesactivarAreaEndpoint, ObtenerAreasEndpoint, DesactivarCategoriaEndpoint, ObtenerCategoriasEndpoint, DesactivarMarcaEndpoint, ObtenerMarcasEndpoint, DesactivarTipoDocumentoEndpoint, ObtenerTipoDocumentoEndpoint, DesactivarPrestamoEndpoint, ObtenerPrestamosEndpoint } from '../../config/apiRoutes'
import { MESSAGES } from '../../constants/messages'
/**
 * Hook para manejar la busqueda de un elemento por su codigo
 *
 * @param {Function} setAlert - Función para mostrar alertas.
 *
 * @returns {Object} - Objeto con el estado del elemento a desactivar, el estado de visivilidad del modal y la funcion para desactivar el elemento.
 */
export const useDeactivate = ({ setAlert, obtener, fetchElements }) => {
  const endpoints = {
    elemento: DeactivateElementsEndPoint,
    usuario: DesactivarUsuarioEndpoint,
    rol: DesactivarRolEndpoint,
    area: DesactivarAreaEndpoint,
    categoria: DesactivarCategoriaEndpoint,
    marca: DesactivarMarcaEndpoint,
    tipoDocumento: DesactivarTipoDocumentoEndpoint,
    prestamo: DesactivarPrestamoEndpoint
  }

  const apiEndpoint = endpoints[obtener]

  const fetchEndpoints = {
    elemento: FetchElementsEndpoint,
    usuario: ObtenerUsuariosEndpoint,
    rol: ObtenerRolesEndpoint,
    area: ObtenerAreasEndpoint,
    categoria: ObtenerCategoriasEndpoint,
    marca: ObtenerMarcasEndpoint,
    tipoDocumento: ObtenerTipoDocumentoEndpoint,
    prestamo: ObtenerPrestamosEndpoint
  }

  const fetchApiEndpoint = fetchEndpoints[obtener]

  // Información para mostrar la alerta de confirmación al deshabilitar
  const [deactivateElement, setDeactivateElement] = useState({
    codigo: null,
    nombre: null,
    usuario: null,
    solicitante: null
  })
  const [showModal, setShowModal] = useState(false)

  // Función que realiza una petición a la API para deshabilitar un elemento, según su codigo
  const handleDeactivate = async () => {
    if (!apiEndpoint) {
      setAlert({
        type: 'error',
        message: 'Tipo de operación inválido',
        active: true
      })
      return
    }

    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        body: JSON.stringify(deactivateElement),
        credentials: 'include'
      })

      const response = await res.json()

      // Verifica si la respuesta contiene un error o un mensaje de exito
      if (response.error) {
        setAlert({
          type: 'error',
          message: MESSAGES[obtener][response.error] || 'Error desconocido',
          active: true
        })
        return false
      }

      if (response.success) {
        fetchElements(fetchApiEndpoint)
        setAlert({
          type: 'success',
          message: MESSAGES[obtener].successDeactivate,
          active: true
        })
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

  return {
    deactivateElement,
    setDeactivateElement,
    showModal,
    setShowModal,
    handleDeactivate
  }
}
