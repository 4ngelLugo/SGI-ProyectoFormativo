import { useRef } from 'react'
import { SaveElementsEndpoint, GuardarRolEndpoint, GuardarAreaEndpoint, GuardarCategoriaEndpoint, GuardarMarcaEndpoint, GuardarTipoDocumentoEndpoint, FetchElementsEndpoint, ObtenerRolesEndpoint, ObtenerAreasEndpoint, ObtenerCategoriasEndpoint, ObtenerMarcasEndpoint, ObtenerTipoDocumentoEndpoint } from '../../config/apiRoutes'

/**
 * Hook para manejar la creación de un nuevo elemento.
 *
 * @param {Function} setAlert - Función para mostrar alertas.
 * @param {String} obtener - Tipo de elemento a crear.
 * @returns {Object} - Objeto con la referencia al formulario y la función de envío.
 */
export const useCreate = ({ setAlert, obtener, fetchElements }) => {
  const endpoints = {
    elemento: SaveElementsEndpoint,
    rol: GuardarRolEndpoint,
    area: GuardarAreaEndpoint,
    categoria: GuardarCategoriaEndpoint,
    marca: GuardarMarcaEndpoint,
    tipoDocumento: GuardarTipoDocumentoEndpoint
  }

  const fetchEndpoints = {
    elemento: FetchElementsEndpoint,
    rol: ObtenerRolesEndpoint,
    area: ObtenerAreasEndpoint,
    categoria: ObtenerCategoriasEndpoint,
    marca: ObtenerMarcasEndpoint,
    tipoDocumento: ObtenerTipoDocumentoEndpoint
  }

  const fetchApiEndpoint = fetchEndpoints[obtener]

  const apiEndpoint = endpoints[obtener]

  // Referencia al formulario para acceder a los datos
  const formRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(formRef.current)

    if (!apiEndpoint) {
      setAlert({ type: 'error', message: 'Tipo de operación inválido', active: true })
      return
    }

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

    // Realiza la peticion al endpoint de guardar elementos, usando el metodo POST y enviando el objeto FormData
    fetch(apiEndpoint, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((response) => {
        // Verifica si la respuesta contiene un error o un mensaje de exito
        if (response.error) {
          const messages = {
            'metodo invalido': 'Error en el metodo de envio',
            'campos vacios': 'Por favor complete todos los campos',
            'ya existe': `Ya existe este ${obtener}`,
            'error al guardar': `Ocurrio un error al crear el ${obtener}`,
            'error de conexion a la base de datos': 'Error al conectar con la base de datos'
          }
          setAlert({ type: 'error', message: messages[response.error] || 'Error desconocido', active: true })
        } else if (response.success) {
          setAlert({ type: 'success', message: 'Elemento guardado correctamente', active: true })

          if (typeof fetchElements === 'function') {
            fetchElements(fetchApiEndpoint)
          }
        }
      })
      // En caso de que ocurra un error en la petición, o un error en el servidor, se captura y se muestra un mensaje de error
      .catch((error) => {
        console.error(error)
        setAlert({ type: 'error', message: 'Ocurrio un error en la petición', active: true })
      })
  }

  return {
    formRef,
    handleSubmit
  }
}
