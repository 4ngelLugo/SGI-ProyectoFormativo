import { useState } from 'react'

export const useValidateInput = ({ required, type, nombre }) => {
  const [errorLabel, setErrorLabel] = useState('')

  const regexNumeros = /^[^\d]*$/
  const regexEspeciales = /^[a-zA-ZÀ-ÿ\s_-]*$/

  const today = new Date().toISOString().split('T')[0]

  const validate = (e) => {
    if (!required) return

    const inputValue = e.target.value.trim()

    if (inputValue === '') {
      setErrorLabel('Este campo es obligatorio')
    } else if (type === 'date' && new Date(inputValue) < new Date(today)) {
      setErrorLabel('La fecha no puede ser anterior a hoy')
    } else if (nombre && !regexNumeros.test(inputValue)) {
      setErrorLabel('No se permiten numeros en este campo')
    } else if (!regexEspeciales.test(inputValue) && type !== 'email' && type !== 'date') {
      setErrorLabel('No se permiten caracteres especiales')
    } else {
      setErrorLabel('')
    }
  }

  return { errorLabel, validate, today }
}
