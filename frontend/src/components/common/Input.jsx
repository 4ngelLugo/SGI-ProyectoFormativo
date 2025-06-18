import { useValidateInput } from '../../hooks/commonHooks/useValidateInput'

export default function Input ({ type, placeholder, name, defaultValue, required }) {
  const { errorLabel, validate } = useValidateInput({ required, type })

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
      />
      <p className='errorLabel'>{errorLabel}</p>
    </div>
  )
}
