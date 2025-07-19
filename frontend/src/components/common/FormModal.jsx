import '../../styles/modal.css'
import '../../styles/globals/forms.css'
import Input from './Input'
import SelectInput from './SelectInput'

export default function ConfirmModal ({ icon, title, message, showModal, setShowModal, formRef, handleSubmit, inputTipo }) {
  const tipoOptions = [
    {
      id: 'devolutivo',
      nombre: 'devolutivo'
    },
    {
      id: 'consumible',
      nombre: 'consumible'
    }
  ]

  return (
    <div className={`modal--container ${showModal ? 'show' : ''}`}>
      <form className='modal form' ref={formRef} onSubmit={handleSubmit}>
        {icon && <img src={icon} alt='' width='64px' />}
        {title && <p className='modal--title'>{title}</p>}
        {message && <span>{message}</span>}
        <Input type='text' placeholder='Nombre' name='nombre' required />
        {inputTipo &&
          <SelectInput options={tipoOptions} placeholder='Tipo de categoria' name='tipo' required />}
        <div className='modal_buttons'>
          {/* Botones para cancelar o confirmar */}
          <button type='button' onClick={() => setShowModal(false)} className='modal--cancel'>Cancelar</button>
          <button
            type='submit'
            onClick={() => {
              setShowModal(false)
            }}
            className='modal--confirm'
          >
            Confirmar
          </button>
        </div>
      </form>
    </div>
  )
}
