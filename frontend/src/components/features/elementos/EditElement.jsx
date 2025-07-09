import { useFetchByCode, useEdit, useFetch } from '../../../hooks'
import Input from '../../common/Input'
import SelectInput from '../../common/SelectInput'
import '../../../styles/globals/forms.css'

export default function EditElement ({ setAlert, searchedEdit, setActiveView }) {
  // Hook para manejar la edición de elementos, incluyendo la lógica para el formulario y su referencia
  const { formRef, handleSubmit } = useEdit({ setAlert, obtener: 'elemento', setActiveView })

  // Hook para obtener el elemento a editar por su código
  const { loading, element } = useFetchByCode({ setAlert, codeToSearch: searchedEdit, obtener: 'elemento' })

  // Obtiene los datos de las areas, categorias, marcas, y los filtra para no mostrar aquellos que esten desactivados
  const { elements: areas } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'areas' })
  const filteredAreas = areas ?? areas.filter((el) => el.estado === 'activo')

  const { elements: categorias } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'categorias' })
  const filterCategorias = categorias.filter((el) => el.estado === 'activo')
  const filteredCategorias = element
    ? filterCategorias.filter((el) => el.tipo === element.tipo)
    : []

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
                <p className='message'>El codigo del elemento no es editable.</p>
                <p className='message'>Los campos marcados con asterisco (*) son obligatorios.</p>

                <Input type='text' placeholder='Código' name='codigo' defaultValue={element.codigo} required readOnly />
                <Input type='text' placeholder='Nombre' name='nombre' defaultValue={element.nombre} required />
                <SelectInput
                  options={filteredCategorias}
                  placeholder='Categoría'
                  name='categoria'
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
                  name='area'
                  defaultValue={
                    {
                      id: element.area,
                      nombre: element.areaNombre
                    }
                  }
                  required
                />

                <input type='hidden' defaultValue={element.tipo} name='tipo' />

                {/* Campos específicos para tipo devolutivo o consumible */}
                {element.tipo === 'devolutivo'
                  ? (
                    <>
                      <Input type='text' placeholder='Placa (númerica)' name='placa' defaultValue={element.placa} required />
                      <Input type='text' placeholder='Serial' name='serial' defaultValue={element.serial} required />
                      <SelectInput
                        options={filteredMarcas}
                        placeholder='Marca'
                        name='marca'
                        defaultValue={
                          {
                            id: element.marca,
                            nombre: element.marcaNombre
                          }
                        }
                        required
                      />
                      <Input type='text' placeholder='Modelo' name='modelo' defaultValue={element.modelo} required />
                    </>
                    )
                  : element.tipo === 'consumible' && (
                    <>
                      <Input type='number' placeholder='Cantidad (numérica)' name='cantidad' defaultValue={element.cantidad} required />
                      <Input type='text' placeholder='Unidad de medida' name='medida' defaultValue={element.unidadMedida} required />
                    </>
                  )}
                <div className='recomendacion'>
                  <label htmlFor='recomendacion' className='recomendacion__label'>Recomendaciones</label>
                  <textarea
                    name='recomendacion'
                    id='recomendacion'
                    className='recomendacion__textarea'
                    placeholder={'Escribe recomendaciones aqui...\nej. Este elemento necesita x para funcionar...'}
                    defaultValue={element.recomendacion}
                  />
                </div>

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
