import { useState, useEffect } from 'react'
import { useValidateSelect } from '../../hooks/commonHooks/useValidateSelect'
import Select from 'react-select'

export default function SelectInput ({ options, placeholder, name, defaultValue, required, setTipo, isDisabled }) {
  const [selectedOption, setSelectedOption] = useState(null)

  const opciones = options.map(e => ({
    value: e.id,
    label: e.nombre,
    data: e
  }))

  const { errorLabel, validate } = useValidateSelect({ required, selectedOption })

  // Establecer el valor por defecto sólo una vez
  useEffect(() => {
    if (defaultValue && opciones.length > 0) {
      const defaultOpt = opciones.find(opt => opt.value === defaultValue.id)
      setSelectedOption(defaultOpt || null)
    }
  }, [defaultValue?.id, opciones.length])

  const handleChange = (option) => {
    setSelectedOption(option)
    if (setTipo) {
      setTipo(option.data.tipo)
    }
  }

  useEffect(() => {

  }, [])

  return (
    <div>
      <Select
        options={opciones}
        placeholder={`${placeholder}${required ? '*' : ''}`}
        name={name}
        id={name}
        value={selectedOption}
        onChange={handleChange}
        onBlur={validate}
        isDisabled={!!isDisabled}
        menuPlacement='auto'
        menuPortalTarget={document.body}
        styles={{
          control: (base, state) => ({
            ...base,
            height: '43.03px',
            borderColor: errorLabel ? 'red' : base.borderColor,
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
            color: '#84949f',
            paddingLeft: '.35rem'
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

      {errorLabel && <p className='errorLabel'>{errorLabel}</p>}
    </div>
  )
}
