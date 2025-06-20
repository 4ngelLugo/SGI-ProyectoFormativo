import { useValidateInput } from '../../hooks/commonHooks/useValidateInput'

export default function Input({ type, placeholder, name, defaultValue, required, direccion }) {
  const { errorLabel, validate, today } = useValidateInput({ required, type, direccion })

  return (
    <div>
      <input
        type={type}
        placeholder={`${placeholder}${required ? '*' : ''}`}
        name={name}
        id={name}
        onBlur={validate}
        style={errorLabel ? { borderColor: 'red' } : undefined}
        defaultValue={defaultValue && defaultValue}
        min={type === 'date' ? today : ''}
      />
      <p className='errorLabel'>{errorLabel}</p>
    </div>
  )
}
