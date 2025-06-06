import '../../styles/modal.css'
import '../../styles/globals/forms.css'

export default function ConfirmModal ({ icon, title, message, showModal, setShowModal, formRef, handleSubmit }) {
  return (
    <div className={`modal--container ${showModal ? 'show' : ''}`}>
      <form className='modal form' ref={formRef} onSubmit={handleSubmit}>
        {icon && <img src={icon} alt='' width='64px' />}
        {title && <p>{title}</p>}
        {message && <span>{message}</span>}
        <input type='text' placeholder='Nombre' name='nombre' id='nombre' />

        <div>
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
