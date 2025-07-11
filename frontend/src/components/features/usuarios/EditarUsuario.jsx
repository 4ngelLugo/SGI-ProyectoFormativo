import { useEdit, useFetch, useFetchByCode } from '../../../hooks'
import Input from '../../common/Input'
import SelectInput from '../../common/SelectInput'
import '../../../styles/globals/forms.css'

export default function EditarUsuario ({ setAlert, searchedEdit, setActiveView }) {
  // Hook para manejar la creación de usuarios, incluyendo la lógica para el formulario y el tipo de elemento
  const { formRef, handleSubmit } = useEdit({ setAlert, obtener: 'usuario', setActiveView })

  const { loading, element } = useFetchByCode({ setAlert, codeToSearch: searchedEdit, obtener: 'usuario' })

  // Obtiene los datos de las tipos de documento y roles, y los filtra para no mostrar aquellos que esten desactivados
  const { elements: tipoDocumento } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'tipoDocumento' })
  const filteredTipos = tipoDocumento.filter((el) => el.estado === 'activo')

  const { elements: roles } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'roles' })
  const filteredRoles = roles.filter((el) => el.estado === 'activo')

  return (
    <>
      <span className='title'>Editar Usuario</span>

      {
        loading
          ? <p>Cargando...</p>
          : element
            ? (
              <form className='form form--elements' ref={formRef} onSubmit={handleSubmit}>
                <p className='message'>Los campos marcados con asterisco (*) son obligatorios.</p>

                <Input type='number' placeholder='N° de Documento (numérico)' name='documento' defaultValue={element.documento} required readOnly />
                <SelectInput
                  options={filteredTipos}
                  placeholder='Tipo de documento'
                  name='tipo_documento'
                  defaultValue={
                    {
                      id: element.tipoDocumentoId,
                      nombre: element.tipoDocumento
                    }
                  }
                  required
                />
                <Input type='text' placeholder='Nombres' name='nombres' defaultValue={element.nombres} required />
                <Input type='text' placeholder='Apellidos' name='apellidos' defaultValue={element.apellidos} required />
                <Input type='tel' placeholder='Telefono' name='telefono' defaultValue={element.telefono} required />
                <Input type='email' placeholder='Correo Electronico' defaultValue={element.correo} name='correo' required />
                <SelectInput
                  options={filteredRoles}
                  placeholder='Rol'
                  name='rol'
                  defaultValue={
                    {
                      id: element.rol,
                      nombre: element.rolNombre
                    }
                  }
                  required
                />

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
