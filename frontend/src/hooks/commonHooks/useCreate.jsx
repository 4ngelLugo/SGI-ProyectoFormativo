import { useRef } from 'react'
import { SaveElementsEndpoint, GuardarUsuarioEndpoint, GuardarRolEndpoint, GuardarAreaEndpoint, GuardarCategoriaEndpoint, GuardarMarcaEndpoint, GuardarTipoDocumentoEndpoint, FetchElementsEndpoint, ObtenerUsuariosEndpoint, ObtenerRolesEndpoint, ObtenerAreasEndpoint, ObtenerCategoriasEndpoint, ObtenerMarcasEndpoint, ObtenerTipoDocumentoEndpoint, GuardarPrestamoEndpoint, ObtenerPrestamosEndpoint } from '../../config/apiRoutes'
import { MESSAGES } from '../../constants/messages'
/**
 * Hook para manejar la creación de un nuevo elemento.
 *
 * @param {Function} setAlert - Función para mostrar alertas.
 * @param {String} obtener - Tipo de elemento a crear.
 * @returns {Object} - Objeto con la referencia al formulario y la función de envío.
 */
export const useCreate = ({ setAlert, obtener, fetchElements, setActiveView }) => {
  const endpoints = {
    elemento: SaveElementsEndpoint,
    usuario: GuardarUsuarioEndpoint,
    rol: GuardarRolEndpoint,
    area: GuardarAreaEndpoint,
    categoria: GuardarCategoriaEndpoint,
    marca: GuardarMarcaEndpoint,
    tipoDocumento: GuardarTipoDocumentoEndpoint,
    prestamo: GuardarPrestamoEndpoint
  }

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

  const vistas = {
    elemento: 'listElement',
    usuario: 'listarUsuarios',
    rol: 'listarRoles',
    prestamo: 'listarPrestamos'
  }

  const fetchApiEndpoint = fetchEndpoints[obtener]
  const apiEndpoint = endpoints[obtener]

  // Referencia al formulario para acceder a los datos
  const formRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errorLabels = formRef.current.querySelectorAll('.errorLabel')
    const tieneErrores = [...errorLabels].some(p => p.textContent !== '')

    if (tieneErrores) {
      setAlert({
        type: 'error',
        message: 'Hay errores en el formulario',
        active: true
      })
      return
    }

    const formData = new FormData(formRef.current)

    if (!apiEndpoint) {
      setAlert({
        type: 'error',
        message: 'Tipo de operación inválido',
        active: true
      })
      return
    }

    // En caso de que se intente crear un rol, verifica que se seleccione por lo menos un permiso
    if (obtener === 'rol') {
      const form = formRef.current
      const checkboxes = form.querySelectorAll('input[name="permisos[]"]:checked')

      if (checkboxes.length === 0) {
        setAlert({
          type: 'error',
          message: 'Debe seleccionar al menos un permiso',
          active: true
        })
        return
      }
    }

    try {
      // Realiza la peticion al endpoint de guardar elementos, usando el metodo POST y enviando el objeto FormData
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
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
        setAlert({
          type: 'success',
          message: MESSAGES[obtener].successCreate,
          active: true
        })

        if (typeof fetchElements === 'function') {
          fetchElements(fetchApiEndpoint)
        }

        if (vistas[obtener]) {
          setActiveView(vistas[obtener])
        }

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
    formRef,
    handleSubmit
  }
}
