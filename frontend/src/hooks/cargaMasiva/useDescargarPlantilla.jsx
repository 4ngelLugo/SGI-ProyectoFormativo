import { DescargarPlantilla } from '../../config/apiRoutes'

export const useDescargarPlantilla = ({ setAlert }) => {
  const handleDescargar = async () => {
    try {
      const res = await fetch(DescargarPlantilla)

      const response = await res.blob()

      // Crear URL para el blob
      const url = window.URL.createObjectURL(response)

      // Crear un enlace temporal
      const a = document.createElement('a')
      a.href = url
      a.download = 'plantilla_CargaDeEquipos.csv'
      document.body.appendChild(a)
      a.click()

      // Limpiar el enlace y la URL
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
      setAlert({
        type: 'error',
        message: 'Error al descargar la plantilla',
        active: true
      })
    }
  }

  return { handleDescargar }
}
