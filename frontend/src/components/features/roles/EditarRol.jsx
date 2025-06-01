import { useEffect } from 'react'
import { useEdit, useFetchByCode, useFetch } from '../../../hooks'
import '../../../styles/globals/forms.css'

export default function EditarRol ({ setAlert, searchRole }) {
  // Hook para manejar la edición de elementos, incluyendo la lógica para el formulario y su referencia
  const { formRef, handleSubmit } = useEdit({ setAlert, obtener: 'rol' })

  // Hook para obtener el elemento a editar por su código
  const { loading, element } = useFetchByCode({ setAlert, codeToSearch: searchRole, obtener: 'rol' })

  const { elements } = useFetch(setAlert, null, null, 'permisos')

  // Agrupa los permisos por el módulo al que pertenecen
  const permisosPorModulo = (Array.isArray(elements) ? elements : []).reduce((acc, permiso) => {
    // Si el módulo no existe en el acumulador, lo inicializa como un array vacío
    if (!acc[permiso.modulo]) {
      acc[permiso.modulo] = []
    }
    // Agrega el permiso al array correspondiente al módulo
    acc[permiso.modulo].push(permiso)
    return acc
  }, {})

  // Efecto para seleccionar todos los permisos al hacer click en la legenda de cada modulo
  useEffect(() => {
    const fieldsets = formRef.current?.querySelectorAll('fieldset') || []

    fieldsets.forEach(fieldset => {
      const legend = fieldset.querySelector('legend')
      const checkboxes = fieldset.querySelectorAll('input[type="checkbox"]')

      if (legend && checkboxes.length > 0) {
        legend.style.cursor = 'pointer' // estilo visual
        legend.onclick = () => {
          const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked)
          checkboxes.forEach(checkbox => (checkbox.checked = !allChecked))
        }
      }
    })
  }, [elements, element])

  return (
    <>
      <span className='title'>Editar Rol: {element && element.nombre}</span>
      {
        loading
          ? <p>Cargando...</p>
          : element
            ? (
              <form className='form' ref={formRef} onSubmit={handleSubmit}>
                <input type='hidden' value={element && element.id} name='rol_id' />
                <input type='text' placeholder='Nombre' name='rol_nombre' id='rol_nombre' defaultValue={element.nombre} />

                <div>
                  <p className='form__check--title'>Permisos</p>
                  {/* Muestra los permisos agrupados por módulo */}
                  {Object.entries(permisosPorModulo).map(([modulo, permisos]) => (
                    <fieldset key={modulo} className='form__check--modules__container'>
                      <legend>{modulo.charAt(0).toUpperCase() + modulo.slice(1)}</legend>

                      <ul className='form__check--list'>
                        {/* Muestra cada permiso dentro del módulo */}
                        {permisos.map(permiso => (
                          <div className='form__check--list__check' key={permiso.id}>
                            <input
                              id={permiso.id}
                              type='checkbox'
                              name='permisos[]'
                              value={permiso.id}
                              defaultChecked={element.permisos?.includes(permiso.id)}
                            />
                            <label htmlFor={permiso.id}>
                              {permiso.nombre.charAt(0).toUpperCase() + permiso.nombre.slice(1)}
                            </label>
                          </div>
                        ))}
                      </ul>
                    </fieldset>
                  ))}
                </div>

                <button className='form__button' type='submit'>Enviar</button>
              </form>
              )
            : (
              <p>No se encontró el rol</p>
              )
      }
    </>
  )
}
