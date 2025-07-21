import { useCallback, useState, useEffect } from 'react'
import { ComprobarArchivo, SubirArchivo, CargarArchivo } from '../../config/apiRoutes'

function useSubirArchivo ({ setAlert }) {
  const [archivo, setArchivo] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [elementos, setElementos] = useState([])
  const [duplicados, setDuplicados] = useState([])
  const [dupBaseDatos, setDupBaseDatos] = useState([])
  const [erroresValidacion, setErroresValidacion] = useState([])

  const handleSubir = useCallback(async () => {
    if (!archivo) return

    setDuplicados([])

    if (!archivo.name.endsWith('.csv')) {
      setAlert({
        type: 'error',
        message: 'Por favor seleccione un archivo CSV válido',
        active: true
      })
      return
    }

    setCargando(true)

    const formData = new FormData()
    formData.append('archivo', archivo)

    try {
      const resSubir = await fetch(SubirArchivo, {
        method: 'POST',
        body: formData
      })

      const responseSubir = await resSubir.json()

      if (!responseSubir.success) {
        setAlert({
          type: 'error',
          message: responseSubir.message || 'Ocurrió un error al subir el archivo',
          active: true
        })
      }

      const datos = responseSubir.datos || []
      setElementos(datos)

      const codigosVistos = new Map()
      const duplicadosTemp = []

      datos.forEach((fila, index) => {
        const codigo = fila.elemento_codigo
        if (codigosVistos.has(codigo)) {
          duplicadosTemp.push({
            elemento: index,
            coincidencia: codigosVistos.get(codigo)
          })
        } else {
          codigosVistos.set(codigo, index)
        }
      })

      setDuplicados(duplicadosTemp)

      const resComprobar = await fetch(ComprobarArchivo, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ datos })
      })

      const responseComprobar = await resComprobar.json()

      setDupBaseDatos(new Set(responseComprobar.duplicados_bd || []))
      setErroresValidacion(new Map(Object.entries(responseComprobar.errores)))
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Ocurrió un error al subir el archivo',
        active: true
      })
    } finally {
      setCargando(false)
    }
  }, [archivo])

  // Subida automática cuando se cambie el archivo
  useEffect(() => {
    if (archivo) handleSubir()
  }, [archivo])

  const handleRegistrar = async () => {
    try {
      const res = await fetch(CargarArchivo, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ datos: elementos })
      })

      const response = await res.json()
      console.log(response)

      if (response.success) {
        setAlert({
          type: 'success',
          message: response.message || 'Elementos registrados correctamente',
          active: true
        })

        setArchivo(null)
        setElementos([])
        setDuplicados([])
        setDupBaseDatos([])
        setErroresValidacion([])
      } else {
        setAlert({
          type: 'error',
          message: response.message || 'Ocurrió un error al registrar los elementos',
          active: true
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    archivo,
    setArchivo,
    cargando,
    elementos,
    duplicados,
    dupBaseDatos,
    erroresValidacion,
    handleRegistrar
  }
}

export { useSubirArchivo }
