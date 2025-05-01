import { useRef, useState } from "react"
import { SaveElementsEndpoint } from "../../config/apiRoutes"

export default function CreateElements({ setAlert }) {
  //Referencia al formulario para acceder a los datos
  const formRef = useRef(null)

  //Estado para el tipo de elemento que quiera registrar el usuario
  const [tipo, setTipo] = useState('devolutivo')

  const handleSubmit = (e) => {
    e.preventDefault()

    //Crea un nuevo objeto FormData a partir del formulario
    const formData = new FormData(formRef.current)

    //Realiza la peticion al endpoint de guardar elementos, usando el metodo POST y enviando el objeto FormData
    fetch(SaveElementsEndpoint, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((response) => {
        //Verifica si la respuesta contiene un error o un mensaje de exito
        if (response.error) {
          switch (response.error) {
            case 'invalid method':
              setAlert({ type: 'error', message: 'Error en el metodo de envio', active: true })
              break
            case 'database connection error':
              setAlert({ type: 'error', message: 'Error al conectar con la base de datos', active: true })
              break
            case 'invalid type':
              setAlert({ type: 'error', message: 'Tipo de elemento invalido', active: true })
              break
            case 'campos vacios':
              setAlert({ type: 'error', message: 'Por favor llena todos los campos', active: true })
              break
            case 'elemento ya existe':
              setAlert({ type: 'error', message: 'Ya existe un elemento con el mismo codigo', active: true })
              break
            case 'error al guardar':
              setAlert({ type: 'error', message: 'Ocurrio un error al guardar el elemento', active: true })
              break
          }
        } else if (response.success) {
          setAlert({ type: 'success', message: 'Elemento guardado correctamente', active: true })
        }
      })
      //En caso de que ocurra un error en la petición, o un error en el servidor, se captura y se muestra un mensaje de error
      .catch((error) => {
        console.error(error)
        setAlert({ type: 'error', message: 'Ocurrio un error en la petición', active: true })
      })
  }

  return (
    <>
      <span className="title">Registrar Elemento</span>

      {/* Formulario para registrar un nuevo elemento */}
      <form className='form' ref={formRef} onSubmit={handleSubmit}>
        <input type='number' placeholder='Codigo' name='ele_codigo' id='ele_codigo' />
        <input type='text' placeholder='Nombre' name='ele_nombre' id='ele_nombre' />
        <input type='number' placeholder='Area' name='ele_area' id='ele_area' />

        {/* Selección del tipo de elemento (devolutivo o consumible) */}
        <div className={`form__type ${tipo === 'consumible' ? 'form__type--consumible' : ''}`}>
          <input
            type='radio'
            value='devolutivo'
            name='tipo'
            id='tipo-devolutivo'
            checked={tipo === 'devolutivo'}
            className={tipo === 'devolutivo' ? 'form__type--active' : ''}
            onChange={() => setTipo('devolutivo')} />
          <label htmlFor='tipo-devolutivo'>Devolutivo</label>

          <input
            type='radio'
            value='consumible'
            name='tipo'
            id='tipo-consumible'
            className={tipo === 'consumible' ? 'form__type--active' : ''}
            checked={tipo === 'consumible'}
            onChange={() => setTipo('consumible')} />
          <label htmlFor='tipo-consumible'>Consumible</label>
        </div>

        {/* Campos específicos para tipo devolutivo */}
        {tipo === 'devolutivo' ? (
          <>
            <input type='number' placeholder='Placa' name='ele_placa' id='ele_placa' />
            <input type='text' placeholder='Serial' name='ele_serial' id='ele_serial' />
            <input type='number' placeholder='Marca' name='ele_marca' id='ele_marca' />
            <input type='text' placeholder='Modelo' name='ele_modelo' id='ele_modelo' />
          </>
        ) : (
          // Campos específicos para tipo consumible
          <>
            <input type='number' placeholder='Cantidad' name='ele_cant' id='ele_cant' />
            <input type='text' placeholder='Unidad de medida' name='ele_medida' id='ele_medida' />
          </>
        )}
        <button className="form__button" type="submit">Enviar</button>
      </form>
    </>
  )
}
