import { useEffect } from 'react'
import { useCreate, useFetch } from '../../../hooks'
import '../../../styles/globals/forms.css'

export default function CrearRol ({ setAlert }) {
  const { formRef, handleSubmit } = useCreate({ setAlert, obtener: 'rol' })
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
  }, [elements])

  return (
    <>
      <span className='title'>Crear Rol</span>

      <form className='form' ref={formRef} onSubmit={handleSubmit}>
        <input type='text' placeholder='Nombre' name='rol_nombre' id='rol_nombre' />

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
                    <input id={permiso.id} type='checkbox' name='permisos[]' value={permiso.id} />
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
    </>
  )
}
