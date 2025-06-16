import { useState } from 'react'

export const useValidateSelect = ({ required, selectedOption, isMulti = false }) => {
  const [errorLabel, setErrorLabel] = useState('')

  const validate = () => {
    if (!required) return

    const isEmpty = isMulti
      ? !selectedOption || selectedOption.length === 0
      : !selectedOption || selectedOption.value === undefined || selectedOption.value === null || selectedOption.value === ''

    if (isEmpty) {
      setErrorLabel('Este campo es obligatorio')
    } else {
      setErrorLabel('')
    }
  }

  return { errorLabel, validate }
}
