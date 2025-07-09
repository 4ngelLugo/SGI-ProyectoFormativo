import { useEffect, useState } from 'react'
import { useCreate, useFetch } from '../../../hooks'
import Select from 'react-select'
import Input from '../../common/Input'
import '../../../styles/formPrestamos.css'

export default function CrearPrestamo ({ setAlert, setActiveView }) {
  const [devolutivos, setDevolutivos] = useState([])
  const [consumibles, setConsumibles] = useState([])
  const [seleccionadosDevolutivos, setSeleccionadosDevolutivos] = useState([])
  const [seleccionadosConsumibles, setSeleccionadosConsumibles] = useState([])

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

  const usuario = JSON.parse(localStorage.getItem('user'))

  const { formRef, handleSubmit } = useCreate({ setAlert, obtener: 'prestamo', setActiveView })

  return (
    <>
      <span className='title'>Solicitar Prestamo</span>
      <form className='form' ref={formRef} onSubmit={handleSubmit}>
        <p className='message'>Los campos marcados con asterisco (*) son obligatorios.</p>

        <input type='hidden' value='Almacenista' name='usertype' />
        <input type='hidden' value={usuario.documento} name='usuario_documento' />

        <section className='prestamo-solicitante'>
          <h3 className='prestamo-seccion-titulo'>Información del solicitante</h3>
          <Input type='number' placeholder='Documento del solicitante' name='identificacion' required />
          <Input type='text' placeholder='Nombres y apellidos del solicitante' name='nombre_apellido' required />
          <Input type='tel' placeholder='Teléfono del solicitante' name='telefono' required />
          <Input type='email' placeholder='Correo del solicitante' name='correo' required />
          <Input type='text' placeholder='Dirección del solicitante' name='direccion' required direccion />
          <div className='prestamo-fechas'>
            <div>
              <label htmlFor='fecha_entrega' className='prestamo-label'>Fecha de entrega al solicitante*</label>
              <Input type='date' placeholder='Fecha de entrega' name='fecha_entrega' required />
            </div>
            <div>
              <label htmlFor='fecha_devolucion' className='prestamo-label'>Fecha de devolución de elementos*</label>
              <Input type='date' placeholder='Fecha de devolución' name='fecha_devolucion' required />
            </div>
          </div>
          <Input type='text' placeholder='Destino de los elementos' name='destino_general' required />

          <div className='prestamo-tipo'>
            <label className='prestamo-label'>Tipo de solicitud*</label>
            <div className='prestamo-radio-opciones'>
              <label className='prestamo-radio-label'>
                <input type='radio' name='tipo_prestamo' value='inmediato' required />
                Préstamo inmediato
              </label>
              <label className='prestamo-radio-label'>
                <input type='radio' name='tipo_prestamo' value='reserva' required />
                Reserva
              </label>
            </div>
          </div>

        </section>

        <section className='prestamo-consumibles'>
          <h3 className='prestamo-seccion-titulo'>Seleccionar devolutivos</h3>
          <Select
            options={devolutivos}
            isMulti
            name='devolutivos[]'
            onChange={handleChangeDevolutivos}
            className='prestamo-select'
            placeholder='Buscar devolutivos'
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
              <div key={data.codigo} className='prestamo-elemento'>
                <span className='prestamo-info__codigo'>{data.codigo}</span>
                <span className='prestamo-info__nombre'>{data.nombre}</span>
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
            className='prestamo-select'
            placeholder='Buscar consumibles'
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
            {seleccionadosConsumibles.map(data => (
              <div key={data.codigo} className='prestamo-elemento'>
                <span className='prestamo-info__codigo'>{data.codigo}</span>
                <span className='prestamo-info__nombre'>{data.nombre}</span>

                <input
                  type='number'
                  // name={`consumibles[${data.codigo}][cantidad]`}
                  placeholder='Cantidad'
                  min='1'
                  max={data.cantidad}
                  className='prestamo-cantidad-input'
                />
                <div className='prestamo-stock'>
                  <label className='prestamo-label'>Cantidad disponible: </label>
                  <span>{data.cantidad}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <label htmlFor='observaciones' className='prestamo-label'>Observaciones</label>
          <textarea name='observaciones' id='observaciones' className='prestamo-textarea' placeholder='Escribe observaciones aquí...' />
        </section>

        <button className='form__button' type='submit'>Enviar</button>
      </form>
    </>
  )
}
