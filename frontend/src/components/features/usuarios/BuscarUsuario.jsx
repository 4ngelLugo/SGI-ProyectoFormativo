import { useFetchByCode, useFetch } from '../../../hooks'
import Select from 'react-select'
import '../../../styles/globals/lists.css'
import { useEffect, useState } from 'react'

export default function BuscarUsuario ({ setAlert, searchedItem, setSearchedItem }) {
  const {
    loading,
    element,
    setElement,
    setLoading
  } = useFetchByCode({ setAlert, codeToSearch: searchedItem, obtener: 'usuario' })

  const {
    elements
  } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'usuarios' })

  const opciones = elements.map(e => ({
    value: e.documento,
    label: `${e.documento}: ${e.nombres} ${e.apellidos}`,
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

  return (
    <>
      <span className='title see-title'>
        Buscar usuario
        <div className='search-input'>
          <Select
            options={opciones}
            placeholder='Buscar usuario'
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
            <div className='element-info__container'>
              <Info label='Documento' value={element.documento} />
              <Info label='Tipo de documento' value={element.tipoDocumento} />
              <Info label='Nombres' value={element.nombres} />
              <Info label='Apellidos' value={element.apellidos} />
              <Info label='Telefono' value={element.telefono} />
              <Info label='Correo' value={element.correo} />
              <Info label='Rol' value={element.rolNombre} />
              <Info label='Estado' value={element.estado} />
            </div>
            )
          : (<p className='notFound--message'>No se encontró ningun usuario usuario</p>)}
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
