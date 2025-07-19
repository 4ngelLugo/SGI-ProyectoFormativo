import { useEffect, useState } from 'react'
import useValidateInput from '../../hooks/commonHooks/useValidateInput'

export default function Input ({
  type,
  placeholder,
  name,
  className,
  defaultValue,
  min,
  max,
  required,
  isDisabled,
  readOnly,
  noEspecial,
  noDateValidate,
  isCreatePassword,
  isConfirmPassword,
  originalPassword,
  onChange = () => { }
}) {
  const { errorLabel, validate, today } = useValidateInput({
    required,
    type,
    noEspecial,
    noDateValidate,
    min,
    max,
    isCreatePassword,
    isConfirmPassword,
    originalPassword
  })
  const [minimo, setMinimo] = useState(today)

  useEffect(() => {
    if (type !== 'date') return

    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!regex.test(min)) return

    const date = new Date(min)
    const partes = min.split('-')
    const esValida = !isNaN(date.getTime()) &&
      date.getUTCFullYear() === parseInt(partes[0], 10) &&
      date.getUTCMonth() + 1 === parseInt(partes[1], 10) &&
      date.getUTCDate() === parseInt(partes[2], 10)

    if (esValida) {
      setMinimo(min)
    }
  }, [min, type])

  return (
    <div className={className}>
      <input
        type={type}
        placeholder={`${placeholder}${required ? '*' : ''}`}
        name={name}
        id={name}
        onChange={(e) => onChange(e.target.value)}
        onBlur={validate}
        style={errorLabel ? { borderColor: 'red' } : undefined}
        defaultValue={defaultValue}
        min={type === 'date' ? minimo : min}
        max={max}
        disabled={isDisabled}
        readOnly={readOnly}
        className={(isDisabled || readOnly) && 'grayText'}
      />
      {errorLabel && <p className='errorLabel'>{errorLabel}</p>}
    </div>
  )
}
