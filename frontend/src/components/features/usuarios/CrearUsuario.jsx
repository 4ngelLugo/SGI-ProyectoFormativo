import { useCreate, useFetch } from '../../../hooks'
import Input from '../../common/Input'
import SelectInput from '../../common/SelectInput'
import '../../../styles/globals/forms.css'

export default function CrearUsuario ({ setAlert, setActiveView }) {
  // Hook para manejar la creación de usuarios, incluyendo la lógica para el formulario y el tipo de elemento
  const { formRef, handleSubmit } = useCreate({ setAlert, obtener: 'usuario', setActiveView })

  // Obtiene los datos de las tipos de documento y roles, y los filtra para no mostrar aquellos que esten desactivados
  const { elements: tipoDocumento } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'tipoDocumento' })
  const filteredTipos = tipoDocumento.filter((el) => el.estado === 'activo')

  const { elements: roles } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'roles' })
  const filteredRoles = roles.filter((el) => el.estado === 'activo')

  return (
    <>
      <span className='title'>Registrar Usuario</span>

      {/* Formulario para registrar un nuevo elemento */}
      <form className='form form--elements' ref={formRef} onSubmit={handleSubmit}>
        <p className='message'>Los campos marcados con asterisco (*) son obligatorios.</p>

        <Input type='number' placeholder='N° de Documento (numérico)' name='documento' required />
        <SelectInput options={filteredTipos} placeholder='Tipo de documento' name='tipo_documento' required />
        <Input type='text' placeholder='Nombres' name='nombres' required />
        <Input type='text' placeholder='Apellidos' name='apellidos' required />
        <Input type='tel' placeholder='Telefono' name='telefono' required />
        <Input type='email' placeholder='Correo Electronico' name='correo' required />
        <SelectInput options={filteredRoles} placeholder='Rol' name='rol' required />
        <Input type='password' placeholder='Contraseña' name='contrasena' required />
        <Input type='password' placeholder='Confirmar contraseña' name='confirmar' required />

        <button className='form__button' type='submit'>Enviar</button>
      </form>
    </>
  )
}
