/* global localStorage */
import { useEffect, useState } from 'react'
import { useEdit, useFetch, useFetchByCode } from '../../../hooks'
import Select from 'react-select'
import Input from '../../common/Input'
import '../../../styles/formPrestamos.css'
import { Icon } from '@iconify/react'

export default function EditarPrestamo ({ setAlert, searchedEdit, setActiveView }) {
  const [devolutivos, setDevolutivos] = useState([])
  const [consumibles, setConsumibles] = useState([])
  const [seleccionadosDevolutivos, setSeleccionadosDevolutivos] = useState([])
  const [seleccionadosConsumibles, setSeleccionadosConsumibles] = useState([])

  const {
    formRef,
    handleSubmit
  } = useEdit({ setAlert, obtener: 'prestamo', setActiveView })

  const {
    elements
  } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'elementos' })

  useEffect(() => {
    const consumiblesData = elements.filter(e => e.tipo === 'consumible')
    const devolutivaData = elements.filter(e => e.tipo === 'devolutivo')
    const consumibleopciones = consumiblesData.map(e => ({
      value: e.codigo,
      label: e.nombre,
      data: e
    }))
    const devolutivoOpciones = devolutivaData.map(e => ({
      value: e.codigo,
      label: e.nombre,
      data: e
    }))

    setConsumibles(consumibleopciones)
    setDevolutivos(devolutivoOpciones)
  }, [elements])

  const handleChangeDevolutivos = (selectedOptions) => {
    const datos = selectedOptions.map(opt => opt.data)
    setSeleccionadosDevolutivos(datos)
  }

  const handleChangeConsumibles = (selectedOptions) => {
    const datos = selectedOptions.map(opt => opt.data)
    setSeleccionadosConsumibles(datos)
  }

  const { loading, element } = useFetchByCode({ setAlert, codeToSearch: searchedEdit, obtener: 'prestamo' })

  console.log(element)

  const usuario = JSON.parse(localStorage.getItem('user'))

  const [observacion, setObservacion] = useState('')
  const [defaultDevolutivosSelect, setDefaultDevolutivosSelect] = useState([])
  const [defaultConsumiblesSelect, setDefaultConsumiblesSelect] = useState([])

  useEffect(() => {
    if (element?.prestamo?.prestamo_observacion) {
      setObservacion(element.prestamo.prestamo_observacion)
    }
  }, [element])

  useEffect(() => {
    if (element && devolutivos.length > 0 && consumibles.length > 0) {
      const selectedDev = devolutivos.filter(opt =>
        element?.elementos.some(e =>
          e.elemento_codigo === opt.value &&
          e.elemento_tipo === 'devolutivo')
      )

      const selectedCons = consumibles.filter(opt =>
        element?.elementos.some(e =>
          e.elemento_codigo === opt.value &&
          e.elemento_tipo === 'consumible')
      )

      setDefaultDevolutivosSelect(selectedDev)
      setSeleccionadosDevolutivos(selectedDev.map(opt => opt.data))

      setDefaultConsumiblesSelect(selectedCons)
      setSeleccionadosConsumibles(selectedCons.map(opt => opt.data))
    }
  }, [element, devolutivos, consumibles])

  return (
    <>
      <span className='title'>Editar Prestamo: {element?.prestamo?.id}</span>

      {
        loading
          ? <p>Cargando...</p>
          : element
            ? (
              <form className='form' ref={formRef} onSubmit={handleSubmit}>
                <input type='hidden' value={element.prestamo.id} name='prestamo_id' />
                <input type='hidden' value={usuario.documento} name='usuario_documento' />

                <section className='prestamo-solicitante'>
                  <h3 className='prestamo-seccion-titulo'>Información del solicitante</h3>
                  <Input type='number' placeholder='Documento del solicitante' name='identificacion' defaultValue={element.prestamo.solicitante_documento} required isDisabled />
                  <Input type='text' placeholder='Nombres y apellidos del solicitante' name='nombre_apellido' defaultValue={element.prestamo.solicitante_nombre} required isDisabled />
                  <Input type='tel' placeholder='Teléfono del solicitante' name='telefono' defaultValue={element.prestamo.solicitante_telefono} required isDisabled />
                  <Input type='email' placeholder='Correo del solicitante' name='correo' defaultValue={element.prestamo.solicitante_correo} required isDisabled />
                  <Input type='text' placeholder='Dirección del solicitante' name='direccion' defaultValue={element.prestamo.solicitante_direccion} required noEspecial isDisabled />
                  <div className='prestamo-fechas'>
                    <div>
                      <label htmlFor='fecha_entrega' className='prestamo-label'>Fecha de entrega al solicitante*</label>
                      <Input type='date' placeholder='Fecha de entrega' name='fecha_entrega' defaultValue={element.prestamo.prestamo_fecha_entrega} required noDateValidate isDisabled />
                    </div>
                    <div>
                      <label htmlFor='fecha_devolucion' className='prestamo-label'>Fecha de devolución de elementos*</label>
                      <Input type='date' placeholder='Fecha de devolución' name='fecha_devolucion' defaultValue={element.prestamo.prestamo_fecha_devolucion} required noDateValidate isDisabled />
                    </div>
                  </div>
                  <Input type='text' placeholder='Destino de los elementos' name='destino_general' defaultValue={element.prestamo.prestamo_destino} required isDisabled />
                </section>

                <section className='prestamo-consumibles'>
                  <h3 className='prestamo-seccion-titulo'>Seleccionar devolutivos</h3>
                  <Select
                    options={devolutivos}
                    isMulti
                    name='devolutivos[]'
                    onChange={handleChangeDevolutivos}
                    value={defaultDevolutivosSelect}
                    className='prestamo-select'
                    placeholder='Buscar devolutivos'
                    isDisabled
                    menuPlacement='auto'
                    menuPortalTarget={document.body}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        height: '43.03px',
                        borderRadius: '12px',
                        cursor: state.isDisabled ? 'not-allowed' : 'pointer'
                      }),
                      input: (base) => ({
                        ...base,
                        fontSize: '1rem',
                        color: '#84949f'
                      }),
                      placeholder: (base) => ({
                        ...base,
                        fontSize: '1rem',
                        color: '#84949f'
                      }),
                      singleValue: (base) => ({
                        ...base,
                        paddingLeft: '.3em',
                        fontSize: '1rem'
                      }),
                      menuPortal: base => ({ ...base, zIndex: 9999 }),
                      menu: base => ({ ...base, zIndex: 9999 })
                    }}
                  />
                  <div className='prestamo-elementos'>
                    {seleccionadosDevolutivos.map(data => (
                      <div key={data.codigo} className='prestamo-elemento devolutivo'>
                        <span className='prestamo-info__codigo'>{data.codigo}</span>
                        <span className='prestamo-info__nombre'>{data.nombre}</span>
                        {data.recomendacion &&
                          <div className='tooltip_prestamos'>
                            <Icon icon='system-uicons:question-circle' width='24' strokeWidth={1.2} />
                            <span className='tooltip'>{data.recomendacion}</span>
                          </div>}
                      </div>
                    ))}
                  </div>
                </section>

                <section className='prestamo-consumibles'>
                  <h3 className='prestamo-seccion-titulo'>Seleccionar consumibles</h3>
                  <Select
                    options={consumibles}
                    isMulti
                    name='consumibles[]'
                    onChange={handleChangeConsumibles}
                    value={defaultConsumiblesSelect}
                    className='prestamo-select'
                    placeholder='Buscar consumibles'
                    isDisabled
                    menuPlacement='auto'
                    menuPortalTarget={document.body}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        height: '43.03px',
                        borderRadius: '12px',
                        cursor: state.isDisabled ? 'not-allowed' : 'pointer'
                      }),
                      input: (base) => ({
                        ...base,
                        fontSize: '1rem',
                        color: '#84949f'
                      }),
                      placeholder: (base) => ({
                        ...base,
                        fontSize: '1rem',
                        color: '#84949f'
                      }),
                      singleValue: (base) => ({
                        ...base,
                        paddingLeft: '.3em',
                        fontSize: '1rem'
                      }),
                      menuPortal: base => ({ ...base, zIndex: 9999 }),
                      menu: base => ({ ...base, zIndex: 9999 })
                    }}
                  />
                  <div className='prestamo-elementos'>
                    {seleccionadosConsumibles.map((data, index) => (
                      <div key={data.codigo} className='prestamo-elemento consumible'>
                        <div className='datos'>
                          <span className='prestamo-info__codigo'>{data.codigo}</span>
                          <span className='prestamo-info__nombre'>{data.nombre}</span>
                          {data.recomendacion &&
                            <div className='tooltip_prestamos'>
                              <Icon icon='system-uicons:question-circle' width='24' strokeWidth={1.2} />
                              <span className='tooltip'>{data.recomendacion}</span>
                            </div>}
                        </div>

                        <div className='prestamo-stock'>
                          <label className='prestamo-label'>Cantidad disponible: </label>
                          <span>{data.cantidad}</span>
                        </div>
                        <div className='prestamo-cantidad'>
                          <span>Cantidad a prestar: </span>
                          <Input
                            type='number'
                            name={`consumibles[${index}][cantidad]`}
                            required
                            min='1'
                            max={data.cantidad}
                            placeholder='Cantidad'
                            className='prestamo-cantidad-input'
                            defaultValue={data.cantidad}
                            isDisabled
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <label htmlFor='observaciones' className='prestamo-label'>Observaciones</label>
                  <textarea
                    name='observaciones'
                    id='observaciones'
                    className='prestamo-textarea'
                    placeholder='Escribe observaciones aquí...'
                    value={observacion}
                    onChange={(e) => setObservacion(e.target.value)}
                  />
                </section>

                <button className='form__button' type='submit'>Enviar</button>
              </form>
              )
            : (
              <p className='notFound--message'>No se encontró el elemento.</p>
              )
      }
    </>
  )
}
