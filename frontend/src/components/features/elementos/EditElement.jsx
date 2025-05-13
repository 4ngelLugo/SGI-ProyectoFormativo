import { useFetchElementByCode } from '../../../hooks'
import useEditElement from '../../../hooks/elementHooks/useEditElement'
import '../../../styles/globals/forms.css'

export default function EditElement({ setAlert, searchElement }) {
  // Hook para manejar la edición de elementos, incluyendo la lógica para el formulario y su referencia
  const { formRef, handleSubmit } = useEditElement(setAlert)

  // Hook para obtener el elemento a editar por su código
  const { loading, element } = useFetchElementByCode({ setAlert, codeToSearch: searchElement })

  return (
    <>
      <span className='title'>Editar Elemento {searchElement}</span>

      {/* Formulario para registrar un nuevo elemento */}
      {
        loading
          ? <p>Cargando...</p>
          : element
            ? (
              <form className='form' ref={formRef} onSubmit={handleSubmit}>
                <input type='hidden' value={element.codigo} name='ele_codigo' />
                <input type='text' placeholder='Nombre' name='ele_nombre' id='ele_nombre' defaultValue={element.nombre} />
                <input type='number' placeholder='Area' name='ele_area' id='ele_area' defaultValue={element.area_id} />

                {/* Selección del tipo de elemento (devolutivo o consumible) */}
                <div className={`form__type ${element.tipo === 'consumible' ? 'form__type--consumible' : ''}`}>
                  {element.tipo === 'devolutivo'
                    ? (
                      <>
                        <input
                          type='radio'
                          value='devolutivo'
                          name='tipo'
                          id='tipo-devolutivo'
                          checked={element.tipo === 'devolutivo'}
                          className={element.tipo === 'devolutivo' ? 'form__type--active' : ''}
                        />
                        <label htmlFor='tipo-devolutivo'>Devolutivo</label>
                      </>
                    )
                    : (
                      <>
                        <input
                          type='radio'
                          value='consumible'
                          name='tipo'
                          id='tipo-consumible'
                          checked={element.tipo === 'consumible'}
                          className={element.tipo === 'consumible' ? 'form__type--active' : ''}
                        />
                        <label htmlFor='tipo-consumible'>Consumible</label>
                      </>
                    )}
                </div>

                {/* Campos específicos para tipo devolutivo o consumible*/}
                {element.tipo === 'devolutivo'
                  ? (
                    <>
                      <input type='number' placeholder='Placa' name='ele_placa' id='ele_placa' defaultValue={element.placa} />
                      <input type='text' placeholder='Serial' name='ele_serial' id='ele_serial' defaultValue={element.serial} />
                      <input type='number' placeholder='Marca' name='ele_marca' id='ele_marca' defaultValue={element.marca_id} />
                      <input type='text' placeholder='Modelo' name='ele_modelo' id='ele_modelo' defaultValue={element.modelo} />
                    </>
                  )
                  : (
                    <>
                      <input type='number' placeholder='Cantidad' name='ele_cant' id='ele_cant' defaultValue={element.cantidad} />
                      <input type='text' placeholder='Unidad de medida' name='ele_medida' id='ele_medida' defaultValue={element.medida} />
                    </>
                  )}
                <button className='form__button' type='submit'>Enviar</button>
              </form>
            )
            : (
              <p>No se encontró el elemento</p>
            )
      }
    </>
  )
}
