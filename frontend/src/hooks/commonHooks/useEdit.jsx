import { useRef } from 'react'
import { UpdateElementsEndpoint, EditarUsuarioEndpoint, EditarRolEndpoint, EditarAreaEndpoint, EditarCategoriaEndpoint, EditarMarcaEndpoint, EditarTipoDocumentoEndpoint, EditarObservacionPrestamo } from '../../config/apiRoutes'
import { MESSAGES } from '../../constants/messages'
/**
 * Hook para manejar la edición de un elemento.
 * Soporta tanto el envío desde formularios HTML como desde objetos JS.
 *
 * @param {Function} setAlert - Función para mostrar alertas.
 * @param {string} obtener - Tipo de recurso a editar ('elemento', 'rol').
 * @returns {Object} - Referencia al formulario y funciones para enviar datos.
 */
export const useEdit = ({ setAlert, obtener, setActiveView }) => {
  const endpoints = {
    elemento: UpdateElementsEndpoint,
    usuario: EditarUsuarioEndpoint,
    rol: EditarRolEndpoint,
    area: EditarAreaEndpoint,
    categoria: EditarCategoriaEndpoint,
    marca: EditarMarcaEndpoint,
    tipoDocumento: EditarTipoDocumentoEndpoint,
    prestamo: EditarObservacionPrestamo
  }

  const vistas = {
    elemento: 'listElement',
    usuario: 'listarUsuarios',
    rol: 'listarRoles',
    prestamo: 'listarPrestamos'
  }

  const apiEndpoint = endpoints[obtener]
  const formRef = useRef(null)

  // Función para editar a través de un formulario
  const handleSubmit = (e) => {
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
    sendRequest(formData)
  }

  // Función para editar directamente en la tabla
  const submitData = async (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    return await sendRequest(formData)
  }

  const sendRequest = async (formData) => {
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
        body: formData,
        credentials: 'include'
      })

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
        setAlert({
          type: 'success',
          message: MESSAGES[obtener].successUpdate,
          active: true
        })

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
    handleSubmit,
    submitData
  }
}
