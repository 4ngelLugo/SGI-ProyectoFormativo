import '../../styles/modal.css'

export default function ConfirmModal ({ icon, title, message, showModal, setShowModal, action }) {
  return (
    <div className={`modal--container ${showModal ? 'show' : ''}`}>
      <div className='modal'>
        {icon && <img src={icon} alt='' width='64px' />}
        <p>{title}</p>
        <span>{message}</span>

        <div>
          {/* Botones para cancelar o confirmar */}
          <button onClick={() => setShowModal(false)} className='modal--cancel'>Cancelar</button>
          <button
            onClick={() => {
              setShowModal(false)
              action()
            }}
            className='modal--confirm'
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
