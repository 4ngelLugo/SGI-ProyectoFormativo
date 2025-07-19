import { useState } from 'react'

const useValidateInput = ({
  required,
  type,
  noEspecial,
  noDateValidate,
  min,
  max,
  isCreatePassword,
  isConfirmPassword,
  originalPassword
}) => {
  const [errorLabel, setErrorLabel] = useState('')
  const regexEspeciales = /^[a-zA-ZÀ-ÿ0-9\s_-]*$/
  const today = new Date().toISOString().split('T')[0]

  const validate = (e) => {
    const inputValue = e.target.value.trim()

    if (required && !inputValue) {
      setErrorLabel('Este campo es obligatorio')
      return
    }

    if (e.target.value < e.target.min) {
      setErrorLabel(`El valor no puede ser menor a ${e.target.min}`)
      return
    }

    if (type === 'date' && !noDateValidate) {
      const inputDate = new Date(inputValue)
      const currentDate = new Date(today)

      if (e.target.min && inputValue < e.target.min) {
        setErrorLabel('La fecha de devolución no puede ser menor a la de entrega')
        return
      }

      if (inputDate < currentDate) {
        setErrorLabel('La fecha no puede ser anterior a hoy')
        return
      }
    }

    if (type === 'number') {
      const numericValue = Number(inputValue)
      if (min !== undefined && numericValue < min) {
        setErrorLabel(`El valor no puede ser menor a ${min}`)
        return
      }
      if (max !== undefined && numericValue > max) {
        setErrorLabel(`El valor no puede ser mayor a ${max}`)
        return
      }
    }

    if (isCreatePassword) {
      if (inputValue.length < 8) {
        setErrorLabel('La contraseña debe tener mínimo 8 caracteres')
        return
      }
      if (!/[a-z]/.test(inputValue)) {
        setErrorLabel('Debe contener al menos una minúscula')
        return
      }
      if (!/[A-Z]/.test(inputValue)) {
        setErrorLabel('Debe contener al menos una mayúscula')
        return
      }
      if (!/\d/.test(inputValue)) {
        setErrorLabel('Debe contener al menos un número')
        return
      }
      if (!/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(inputValue)) {
        setErrorLabel('Debe contener al menos un carácter especial (ej. @, #, !, /, etc.)')
        return
      }
    }

    if (isConfirmPassword && inputValue !== originalPassword) {
      setErrorLabel('Las contraseñas no coinciden')
      return
    }

    if (!isCreatePassword && !isConfirmPassword && !noEspecial && !regexEspeciales.test(inputValue)) {
      setErrorLabel('No se permiten caracteres especiales')
      return
    }

    setErrorLabel('')
  }

  return { errorLabel, validate, today }
}

export default useValidateInput
