import { useFetchByCode, useEdit, useFetch } from '../../../hooks'
import Input from '../../common/Input'
import SelectInput from '../../common/SelectInput'
import '../../../styles/globals/forms.css'

export default function EditElement ({ setAlert, searchedEdit }) {
  // Hook para manejar la edición de elementos, incluyendo la lógica para el formulario y su referencia
  const { formRef, handleSubmit } = useEdit({ setAlert, obtener: 'elemento' })

  // Hook para obtener el elemento a editar por su código
  const { loading, element } = useFetchByCode({ setAlert, codeToSearch: searchedEdit, obtener: 'elemento' })

  // Obtiene los datos de las areas, categorias, marcas, y los filtra para no mostrar aquellos que esten desactivados
  const { elements: areas } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'areas' })
  const filteredAreas = areas.filter((el) => el.estado === 'activo')

  const { elements: categorias } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'categorias' })
  const filteredCategorias = categorias.filter((el) => el.estado === 'activo')

  const { elements: marcas } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'marcas' })
  const filteredMarcas = marcas.filter((el) => el.estado === 'activo')

  return (
    <>
      <span className='title'>Editar Elemento: {searchedEdit}</span>

      {/* Formulario para registrar un nuevo elemento */}
      {
        loading
          ? <p>Cargando...</p>
          : element
            ? (
              <form className='form form--elements' ref={formRef} onSubmit={handleSubmit}>
                <p className='message'>Los campos marcados con asterisco (*) son obligatorios.</p>

                <Input type='number' placeholder='Código (numérico)' name='ele_codigo' defaultValue={element.codigo} required />
                <Input type='text' placeholder='Nombre' name='ele_nombre' defaultValue={element.nombre} required />
                <SelectInput
                  options={filteredCategorias}
                  placeholder='Categoría'
                  name='ele_categoria'
                  defaultValue={
                    {
                      id: element.categoria,
                      nombre: element.categoriaNombre
                    }
                  }
                  required
                />
                <SelectInput
                  options={filteredAreas}
                  placeholder='Área'
                  name='ele_area'
                  defaultValue={
                    {
                      id: element.area,
                      nombre: element.areaNombre
                    }
                  }
                  required
                />

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
                      <Input type='text' placeholder='Placa' name='ele_placa' defaultValue={element.placa} required />
                      <Input type='text' placeholder='Serial' name='ele_serial' defaultValue={element.serial} required />
                      <SelectInput
                        options={filteredMarcas}
                        placeholder='Marca'
                        name='ele_marca'
                        defaultValue={
                          {
                            id: element.marca,
                            nombre: element.marcaNombre
                          }
                        }
                        required
                      />
                      <Input type='text' placeholder='Modelo' name='ele_modelo' defaultValue={element.modelo} required />
                    </>
                    )
                  : (
                    <>
                      <Input type='number' placeholder='Cantidad (numérica)' name='ele_cant' defaultValue={element.cantidad} required />
                      <Input type='text' placeholder='Unidad de medida' name='ele_medida' defaultValue={element.unidadMedida} required />
                    </>
                    )}
                <button className='form__button' type='submit'>Enviar</button>
              </form>
              )
            : (
              <p className='notFound--message'>No se encontró el elemento.</p>
              )
      }
    </>
  )
}
