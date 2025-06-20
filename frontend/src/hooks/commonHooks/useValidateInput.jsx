import { useState } from 'react'

export const useValidateInput = ({ required, type, direccion }) => {
  const [errorLabel, setErrorLabel] = useState('')

  const regexEspeciales = /^[a-zA-ZÀ-ÿ0-9\s_-]*$/

  const today = new Date().toISOString().split('T')[0]

  const validate = (e) => {
    if (!required) return

    const inputValue = e.target.value.trim()

    if (inputValue === '') {
      setErrorLabel('Este campo es obligatorio')
    } else if (type === 'date' && new Date(inputValue) < new Date(today)) {
      setErrorLabel('La fecha no puede ser anterior a hoy')
    } else if (!regexEspeciales.test(inputValue) && type !== 'email' && type !== 'date' && !direccion) {
      setErrorLabel('No se permiten caracteres especiales')
    } else {
      setErrorLabel('')
    }
  }

  return { errorLabel, validate, today }
}
