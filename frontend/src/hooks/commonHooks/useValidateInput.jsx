import { useState } from 'react'

export const useValidateInput = ({ required, type }) => {
  const [errorLabel, setErrorLabel] = useState('')

  const regex = /^[a-zA-Z0-9\s_-]*$/ // permite letras, números, espacio, guión, guión bajo
  const today = new Date().toISOString().split('T')[0]

  const validate = (e) => {
    if (!required) return

    const inputValue = e.target.value.trim()

    if (inputValue === '') {
      setErrorLabel('Este campo es obligatorio')
    } else if (type === 'date' && new Date(inputValue) < new Date(today)) {
      setErrorLabel('La fecha no puede ser anterior a hoy')
    } else if (!regex.test(inputValue) && type !== 'email' && type !== 'date') {
      setErrorLabel('No se permiten caracteres especiales')
    } else {
      setErrorLabel('')
    }
  }

  return { errorLabel, validate, today }
}
