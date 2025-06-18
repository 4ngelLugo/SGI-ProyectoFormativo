import { useState } from 'react'

export const useValidateInput = ({ required, type }) => {
  const [errorLabel, setErrorLabel] = useState('')

  const regex = /^[a-zA-Z0-9\s_-]*$/ // permite letras, números, espacio, guión, guión bajo

  const validate = (e) => {
    if (!required) return

    const inputValue = e.target.value.trim()

    if (inputValue === '') {
      setErrorLabel('Este campo es obligatorio')
    } else if (!regex.test(inputValue) && type !== 'email') {
      setErrorLabel('No se permiten caracteres especiales')
    } else {
      setErrorLabel('')
    }
  }

  return { errorLabel, validate }
}
