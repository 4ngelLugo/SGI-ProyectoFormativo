import { useFetchByCode, useFetch } from '../../../hooks'
import Select from 'react-select'
import '../../../styles/globals/lists.css'
import { useEffect, useState } from 'react'

export default function BuscarPrestamo ({ setAlert, searchedItem, setSearchedItem }) {
  const {
    loading,
    typing,
    element,
    setElement,
    setLoading
  } = useFetchByCode({ setAlert, codeToSearch: searchedItem, obtener: 'prestamo' })

  const devolutivos = element?.elementos.filter(el => el.elemento_tipo === 'devolutivo') || []
  const consumibles = element?.elementos.filter(el => el.elemento_tipo === 'consumible') || []

  const {
    elements
  } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'prestamos' })

  const opciones = elements.map(e => ({
    value: e.id,
    label: `${e.id}`,
    data: e
  }))
  const [selectedOption, setSelectedOption] = useState(null)

  // Cuando cambia searchElement o elements, actualiza el valor del Select
  useEffect(() => {
    if (searchedItem && elements.length > 0) {
      const found = opciones.find(opt => opt.value === searchedItem)
      setSelectedOption(found || null)
    } else {
      setSelectedOption(null)
    }
  }, [searchedItem, elements])

  const handleOnChange = (option) => {
    if (!option) {
      setSearchedItem('')
      setElement(null)
      setLoading(false)
      setSelectedOption(null)
    } else {
      setSearchedItem(option.value)
      setSelectedOption(option)
    }
  }

  const formatFecha = (fechaISO) => {
    const [year, month, day] = fechaISO.split('-') // divide por guiones
    const fecha = new Date(year, month - 1, day) // month empieza en 0

    const dia = fecha.getDate()
    const mes = new Intl.DateTimeFormat('es-CO', { month: 'long' }).format(fecha)
    const anio = fecha.getFullYear()

    return `${dia}, ${mes} de ${anio}`
  }

  return (
    <>
      <span className='title see-title'>
        Buscar prestamo
        <div className='search-input'>
          <Select
            options={opciones}
            placeholder='Buscar prestamo'
            value={selectedOption}
            onChange={handleOnChange}
            isClearable
            menuPlacement='auto'
            menuPortalTarget={document.body}
            styles={{
              control: (base, state) => ({
                ...base,
                borderRadius: '12px',
                cursor: state.isDisabled ? 'not-allowed' : 'pointer',
                minWidth: '15em',
                maxWidth: '15em',
                width: '15em'
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
        </div>
      </span>

      {loading
        ? (<p>Cargando...</p>)
        : element
          ? (
            <>
              <div className='element-info__container'>
                <p className='element-info__subtitle'>Prestamo</p>
                <Info label='ID prestamo' value={element.prestamo.id} />
                <Info label='Prestamista' value={`${element.prestamo.usuario_nombre} ${element.prestamo.usuario_apellido}`} />
                <Info label='Tipo' value={element.prestamo.prestamo_tipo} />
                <Info label='Estado' value={element.prestamo.estado} />
                <Info label='Solicitud' value={formatFecha(element.prestamo.prestamo_fecha_solicitud)} />
                <Info label='Entrega' value={formatFecha(element.prestamo.prestamo_fecha_entrega)} />
                <Info label='Devolución' value={formatFecha(element.prestamo.prestamo_fecha_devolucion)} />
              </div>

              <div className='element-info__container'>
                <p className='element-info__subtitle'>Solicitante</p>
                <Info label='Documento' value={element.prestamo.solicitante_documento} />
                <Info label='Nombre' value={element.prestamo.solicitante_nombre} />
                <Info label='Correo' value={element.prestamo.solicitante_correo} />
                <Info label='Telefono' value={element.prestamo.solicitante_telefono} />
                <Info label='Direccion' value={element.prestamo.solicitante_direccion} />
              </div>

              <div className='element-info__container'>
                <p className='element-info__subtitle'>Elementos</p>
                {devolutivos.length > 0 &&
                  <div className='element-info__elements'>
                    <p style={{ paddingLeft: '1rem' }} className='element-info__title'>Devolutivos</p>
                    {devolutivos.map((devo) => (
                      <Info key={devo.elemento_codigo} label={devo.elemento_codigo} value={`${devo.elemento_nombre}`} />
                    ))}
                  </div>}
                {consumibles.length > 0 &&
                  <div className='element-info__elements'>
                    <p style={{ paddingLeft: '1rem' }} className='element-info__title'>Consumibles</p>
                    {consumibles.map((cons) => (
                      <Info key={cons.elemento_codigo} label={cons.elemento_codigo} value={`${cons.elemento_nombre} - x${cons.elemento_cantidad}`} />
                    ))}
                  </div>}
              </div>

            </>
            )
          : !typing && (<p className='notFound--message'>No se encontró ningun prestamo</p>)}
    </>
  )
}

// Componente reutilizable para mostrar información del elemento
function Info ({ label, value }) {
  return (
    <div className='element-info'>
      <span className='element-info__title'>{label}</span>
      <span className='element-info__content'>{value}</span>
    </div>
  )
}
