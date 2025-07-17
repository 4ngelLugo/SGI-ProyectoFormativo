/* global localStorage */
import { useEffect, useState } from 'react'
import { useCreate, useFetch } from '../../../hooks'
import Select from 'react-select'
import Input from '../../common/Input'
import '../../../styles/formPrestamos.css'
import { Icon } from '@iconify/react'

export default function CrearPrestamo({ setAlert, setActiveView }) {
  const [devolutivos, setDevolutivos] = useState([])
  const [consumibles, setConsumibles] = useState([])
  const [seleccionadosDevolutivos, setSeleccionadosDevolutivos] = useState([])
  const [seleccionadosConsumibles, setSeleccionadosConsumibles] = useState([])
  const [solicitante, setSolicitante] = useState(null)

  const {
    elements
  } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'elementos' })

  const {
    allElements: solicitantes
  } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'solicitantes' })

  const handleSolicitante = (documento) => {
    if (!solicitantes) return

    const match = solicitantes?.find(el => el.documento == documento)
    setSolicitante(match || null)
  }

  // #region Datos Select Elementos
  useEffect(() => {
    const consumiblesData = elements.filter(e =>
      (e.tipo === 'consumible' && e.estado === 'disponible')
    )

    const devolutivaData = elements.filter(e =>
      (e.tipo === 'devolutivo' && e.estado === 'disponible')
    )

    const consumibleopciones = consumiblesData.map(e => ({
      value: e.codigo,
      label: `${e.codigo}: ${e.nombre}`,
      data: e
    }))
    const devolutivoOpciones = devolutivaData.map(e => ({
      value: e.codigo,
      label: `${e.codigo}: ${e.nombre}`,
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
  // #endregion

  const today = new Date().toISOString().split('T')[0]

  const [fechaDevolucionMin, setFechaDevolucionMin] = useState(today)

  const usuario = JSON.parse(localStorage.getItem('user'))

  const { formRef, handleSubmit } = useCreate({ setAlert, obtener: 'prestamo', setActiveView })

  return (
    <>
      <span className='title'>Realizar Prestamo</span>
      <form className='form' ref={formRef} onSubmit={handleSubmit}>
        <p className='message'>Los campos marcados con asterisco (*) son obligatorios.</p>

        <input type='hidden' value={usuario.documento} name='usuario_documento' />

        <section className='prestamo-solicitante'>
          <h3 className='prestamo-seccion-titulo'>Información del solicitante</h3>
          <Input type='number' placeholder='Documento del solicitante' name='identificacion' required onChange={handleSolicitante} />
          <Input type='text' placeholder='Nombres y apellidos del solicitante' name='nombre_apellido' defaultValue={solicitante?.nombre || ''} required />
          <Input type='tel' placeholder='Teléfono del solicitante' name='telefono' defaultValue={solicitante?.telefono || ''} required />
          <Input type='email' placeholder='Correo del solicitante' name='correo' defaultValue={solicitante?.correo || ''} required noEspecial />
          <Input type='text' placeholder='Dirección del solicitante' name='direccion' defaultValue={solicitante?.direccion || ''} required noEspecial />
          <div className='prestamo-fechas'>
            <div>
              <label htmlFor='fecha_entrega' className='prestamo-label'>Fecha de entrega al solicitante*</label>
              <Input type='date' placeholder='Fecha de entrega' name='fecha_entrega' onChange={setFechaDevolucionMin} required />
            </div>
            <div>
              <label htmlFor='fecha_devolucion' className='prestamo-label'>Fecha de devolución de elementos*</label>
              <Input type='date' placeholder='Fecha de devolución' name='fecha_devolucion' min={fechaDevolucionMin} required />
            </div>
          </div>
          <Input type='text' placeholder='Destino de los elementos' name='destino_general' required />
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
            styles={selectStyles}
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
            name='consumibles[][codigo]'
            onChange={handleChangeConsumibles}
            className='prestamo-select'
            placeholder='Buscar consumibles'
            menuPlacement='auto'
            menuPortalTarget={document.body}
            styles={selectStyles}
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
                  />
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

const selectStyles = {
  control: (base, state) => ({
    ...base,
    height: '43.03px',
    borderRadius: '12px',
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    minWidth: '15em',
    maxWidth: '100%',
    flexWrap: 'nowrap',
    overflowX: 'auto'
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
  menu: base => ({ ...base, zIndex: 9999 }),

  // Elementos seleccionados
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'rgba(57, 169, 0, 0.1)', // #39A900 opaco
    borderRadius: '8px'
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#007832' // tu color principal
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#39A900',
    ':hover': {
      backgroundColor: 'rgba(57, 169, 0, 0.2)',
      color: '#2d7a00' // un verde un poco más oscuro
    }
  })
}
