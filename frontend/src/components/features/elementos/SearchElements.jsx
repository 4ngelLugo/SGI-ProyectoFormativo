import { useFetchByCode, useFetch } from '../../../hooks'
import Select from 'react-select'
import '../../../styles/globals/lists.css'
import { useEffect, useState } from 'react'

export default function SearchElements ({ setAlert, searchedItem, setSearchedItem }) {
  const {
    loading,
    element,
    setElement,
    setLoading
  } = useFetchByCode({ setAlert, codeToSearch: searchedItem, obtener: 'elemento' })

  useEffect(() => {
    console.log(element)
  }, [element])

  const {
    allElements: elements
  } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'elementos' })

  const opciones = elements.map(e => ({
    value: e.codigo,
    label: `${e.codigo}: ${e.nombre}`,
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
        Buscar elemento
        <div className='search-input'>
          <Select
            options={opciones}
            placeholder='Buscar elemento'
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
        : element && element.tipo === 'devolutivo'
          ? (
            <div className='element-info__container'>
              <Info label='Nombre' value={element.nombre} />
              <Info label='Categoria' value={element.categoriaNombre} />
              <Info label='Área' value={element.areaNombre} />
              <Info label='Tipo' value={element.tipo} />
              <Info label='Placa' value={element.placa} />
              <Info label='Serial' value={element.serial} />
              <Info label='Marca' value={element.marcaNombre} />
              <Info label='Modelo' value={element.modelo} />
              <Info label='Estado' value={element.estado} />
            </div>
            )
          : element && element.tipo === 'consumible'
            ? (
              <div className='element-info__container'>
                <Info label='Nombre' value={element.nombre} />
                <Info label='Categoria' value={element.categoriaNombre} />
                <Info label='Área' value={element.areaNombre} />
                <Info label='Tipo' value={element.tipo} />
                <Info label='Cantidad' value={`${element.cantidad} ${element.unidadMedida}`} />
                <Info label='Estado' value={element.estado} />
              </div>
              )
            : (<p className='notFound--message'>No se encontró ningun elemento</p>)}
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
