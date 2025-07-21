import { useRef } from 'react'
import { useDescargarPlantilla, useSubirArchivo } from '../../../hooks'
import TooltipCell from '../../common/TooltipCell'
import { Icon } from '@iconify/react'

export default function CargaMasiva ({ setAlert }) {
  const subirInput = useRef(null)

  const { handleDescargar } = useDescargarPlantilla({ setAlert })

  const {
    archivo,
    setArchivo,
    cargando,
    elementos,
    duplicados,
    dupBaseDatos,
    erroresValidacion,
    handleRegistrar
  } = useSubirArchivo({ setAlert })

  // Obtener la cantidad de codigos duplicados en el archivo
  const codigosDuplicados = duplicados.flatMap(d => [d.coincidencia, d.elemento])
  const cantidadDuplicados = new Set(codigosDuplicados)

  const handleSubirClic = () => {
    subirInput.current.click()
  }

  const handleArchivoChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setArchivo(selectedFile)
      e.target.value = null // Limpiar el input para permitir la selección del mismo archivo
    }
  }

  return (
    <>
      <span className='title'>Cargar elementos desde archivo</span>
      <div className='carga_buttons'>
        <button type='button' onClick={handleDescargar} className='descargar'>
          <Icon icon='system-uicons:file-download' width='24' strokeWidth={1.2} />
          Descargar plantilla
        </button>

        <div>
          <input
            ref={subirInput}
            onChange={handleArchivoChange}
            type='file'
            id='file-upload'
            accept='.csv'
            style={{ display: 'none' }}
          />
          <button type='button' onClick={handleSubirClic} className='subir'>
            <Icon icon='system-uicons:file-upload' width='24' strokeWidth={1.2} />
            Subir Archivo CSV
          </button>
        </div>

        <button
          type='button'
          className='comprobar'
          disabled={
            !archivo ||
            cargando ||
            duplicados.size > 0 ||
            dupBaseDatos.size > 0 ||
            erroresValidacion.size > 0
          }
          onClick={handleRegistrar}
        >
          <Icon icon='system-uicons:cloud-upload-alt' width='24' strokeWidth={1.2} />
          Registrar elementos
        </button>
      </div>

      <div className='status-panel'>
        <span className='status-text red'>
          Códigos repetidos:{'\n'}
          <span id='count-duplicados'>{cantidadDuplicados.size}</span>
        </span>
        <span className='status-text orange'>
          Códigos repetidos desde base de datos:{'\n'}
          <span id='count-bd-duplicados'>{dupBaseDatos.size}</span>
        </span>
        <span className='status-text yellow'>
          Errores de validación:{'\n'}
          <span id='count-errores'>{erroresValidacion.size}</span>
        </span>
      </div>

      {cargando
        ? (
          <p>Cargando...</p>
          )
        : elementos && (
          <table className='table'>
            <thead className='table__header'>
              <tr className='table__row'>
                <th>Codigo</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Categoria</th>
                <th>Area</th>
                <th>Placa</th>
                <th>Serial</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Cantidad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody className='table__body'>
              {elementos && elementos.length > 0 && elementos.map(({
                elemento_codigo,
                elemento_nombre,
                elemento_tipo,
                categoria_id,
                area_id,
                elemento_placa,
                elemento_serial,
                marca_id,
                elemento_modelo,
                elemento_cantidad,
                elemento_und_medida
              }, index) => {
                const elementoDuplicado = duplicados.some(el =>
                  el.elemento === index || el.coincidencia === index
                )

                const elementoEnBaseDatos = dupBaseDatos.has(index)

                const errorValidacion = erroresValidacion.has(index.toString())

                return (
                  <tr
                    key={index}
                    className={`table__row ${index % 2 === 1 ? 'table__row--alt' : ''} ${elementoDuplicado
                      ? 'table__row--duplicado'
                      : elementoEnBaseDatos
                        ? 'table__row--dupBase'
                        : errorValidacion ? 'table__row--error' : ''} `}
                  >
                    <TooltipCell text={elemento_codigo} />
                    <TooltipCell text={elemento_nombre} />
                    <TooltipCell text={elemento_tipo} />
                    <TooltipCell text={categoria_id} />
                    <TooltipCell text={area_id} />
                    <TooltipCell text={elemento_placa} />
                    <TooltipCell text={elemento_serial} />
                    <TooltipCell text={marca_id} />
                    <TooltipCell text={elemento_modelo} />
                    <TooltipCell text={`${elemento_cantidad} ${elemento_und_medida}`} />
                    <td>
                      {elementoDuplicado
                        ? (
                          <div className='tooltip-container center'>
                            <span className='status-indicator duplicate'>DUP</span>
                            <span className='tooltip'>Duplicado en archivo</span>
                          </div>
                          )
                        : elementoEnBaseDatos
                          ? (
                            <div className='tooltip-container center'>
                              <span className='status-indicator dupBase'>BD</span>
                              <span className='tooltip'>Duplicado en base de datos</span>
                            </div>
                            )
                          : errorValidacion
                            ? (
                              <div className='tooltip-container center'>
                                <span className='status-indicator error'>ERR</span>
                                <span className='tooltip'>Error de validación</span>
                              </div>
                              )
                            : (
                              <div className='tooltip-container center'>
                                <span className='status-indicator valid'>OK</span>
                                <span className='tooltip'>Sin problemas</span>
                              </div>
                              )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
    </>
  )
}
