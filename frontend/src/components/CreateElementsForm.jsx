import { useEffect, useRef } from "react"

export default function CreateElementsForm() {
  const formRef = useRef(null)
  const controllerAPI = 'http://localhost/sgi-proyectoformativo/backend/elementos/logic/saveLogic.php'

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(formRef.current)

    fetch(controllerAPI, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response)
      })
  }

  useEffect(() => {
    if (!formRef.current) return

    formRef.current.addEventListener('submit', handleSubmit)

    return () => {
      if (formRef.current) {
        formRef.current.removeEventListener('submit', handleSubmit)
      }
    }

  }, [])

  return (
    <>
      <span className="form__title">Registrar Elemento</span>
      <form className='form' ref={formRef}>
        <input type='number' placeholder='Codigo' name='ele_cod' id='ele_cod' />
        <input type='text' placeholder='Nombre' name='ele_nom' id='ele_nom' />
        <input type='number' placeholder='Area' name='ele_area' id='ele_area' />
        <div className='form__input'>
          <input type='radio' value='devolutivo' name='tipo' id='tipo-devolutivo' />
          <label htmlFor='tipo-devolutivo'>Devolutivo</label>

          <input type='radio' value='consumible' name='tipo' id='tipo-consumible' />
          <label htmlFor='tipo-consumible'>Consumible</label>
        </div>
        <input type='number' placeholder='Cantidad' name='ele_cant' id='ele_cant' />
        <button type="submit">Enviar</button>
      </form>
    </>
  )
}
