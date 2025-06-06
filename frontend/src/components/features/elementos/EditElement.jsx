import { useFetchByCode, useEdit, useFetch } from '../../../hooks'
import '../../../styles/globals/forms.css'

export default function EditElement ({ setAlert, searchElement }) {
  // Hook para manejar la edición de elementos, incluyendo la lógica para el formulario y su referencia
  const { formRef, handleSubmit } = useEdit({ setAlert, obtener: 'elemento' })

  // Hook para obtener el elemento a editar por su código
  const { loading, element } = useFetchByCode({ setAlert, codeToSearch: searchElement, obtener: 'elemento' })

  // Obtiene los datos de las areas, categorias, marcas, y los filtra para no mostrar aquellos que esten desactivados
  const { elements: areas } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'areas' })
  const filteredAreas = areas.filter((el) => el.estado === 'activo')

  const { elements: categorias } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'categorias' })
  const filteredCategorias = categorias.filter((el) => el.estado === 'activo')

  const { elements: marcas } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'marcas' })
  const filteredMarcas = marcas.filter((el) => el.estado === 'activo')

  return (
    <>
      <span className='title'>Editar Elemento: {searchElement}</span>

      {/* Formulario para registrar un nuevo elemento */}
      {
        loading
          ? <p>Cargando...</p>
          : element
            ? (
              <form className='form form--elements' ref={formRef} onSubmit={handleSubmit}>
                <input type='hidden' value={element.codigo} name='ele_codigo' />
                <input type='text' placeholder='Nombre' name='ele_nombre' id='ele_nombre' defaultValue={element.nombre} />
                <select name='ele_categoria' id='ele_categoria' defaultValue={element.categoria || ''}>
                  <option value='' hidden>Categoria</option>
                  {filteredCategorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                  ))}
                </select>
                <select name='ele_area' id='ele_area' defaultValue={element.area || ''}>
                  <option value='' hidden>Area</option>
                  {filteredAreas.map((area) => (
                    <option key={area.id} value={area.id}>{area.nombre}</option>
                  ))}
                </select>

                {/* Selección del tipo de elemento (devolutivo o consumible) */}
                <div className={`form__type ${element.tipo === 'consumible' ? 'form__type--consumible' : ''}`}>
                  {element.tipo === 'devolutivo'
                    ? (
                      <>
                        <input
                          type='radio'
                          value='devolutivo'
                          name='ele_tipo'
                          id='tipo-devolutivo'
                          checked={element.tipo === 'devolutivo'}
                          className={element.tipo === 'devolutivo' ? 'form__type--active' : ''}
                          readOnly
                        />
                        <label htmlFor='tipo-devolutivo'>Devolutivo</label>
                      </>
                      )
                    : (
                      <>
                        <input
                          type='radio'
                          value='consumible'
                          name='ele_tipo'
                          id='tipo-consumible'
                          checked={element.tipo === 'consumible'}
                          className={element.tipo === 'consumible' ? 'form__type--active' : ''}
                          readOnly
                        />
                        <label htmlFor='tipo-consumible'>Consumible</label>
                      </>
                      )}
                </div>

                {/* Campos específicos para tipo devolutivo o consumible */}
                {element.tipo === 'devolutivo'
                  ? (
                    <>
                      <input type='number' placeholder='Placa' name='ele_placa' id='ele_placa' defaultValue={element.placa} />
                      <input type='text' placeholder='Serial' name='ele_serial' id='ele_serial' defaultValue={element.serial} />
                      <select name='ele_area' id='ele_area' defaultValue={element.marca || ''}>
                        <option value='' hidden>Marca</option>
                        {filteredMarcas.map((marca) => (
                          <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                        ))}
                      </select>
                      <input type='text' placeholder='Modelo' name='ele_modelo' id='ele_modelo' defaultValue={element.modelo} />
                    </>
                    )
                  : (
                    <>
                      <input type='number' placeholder='Cantidad' name='ele_cant' id='ele_cant' defaultValue={element.cantidad} />
                      <input type='text' placeholder='Unidad de medida' name='ele_medida' id='ele_medida' defaultValue={element.unidadMedida} />
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
