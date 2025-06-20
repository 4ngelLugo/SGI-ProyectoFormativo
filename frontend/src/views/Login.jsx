import '../styles/login.css'
import LoadingScreen from '../components/common/LoadingScreen'
import logoSena from '../assets/images/logoSena.png'
import { useEffect, useRef, useState } from 'react'
import { tryConnect, useGetTime } from '../hooks'

export default function Login () {
  const [loading, setLoading] = useState(true)

  const { hour, period, date } = useGetTime()

  const timestamp = useRef(null)
  const form = useRef(null)

  const { formRef, error, handleSubmit } = tryConnect()

  const showLogin = () => {
    const timestampRef = timestamp.current
    const formRef = form.current

    if (!timestampRef || !formRef) return

    timestampRef.style.transform = 'translateY(-100%)'
    formRef.style.transform = 'translateY(-100%)'
    setTimeout(() => {
      formRef.style.backgroundColor = '#00000011'
      formRef.style.backdropFilter = 'blur(5px)'
    }, 300)
  }

  useEffect(() => {
    if (loading) return

    window.document.addEventListener('click', showLogin)
    window.document.addEventListener('keydown', showLogin)

    return () => {
      window.document.removeEventListener('click', showLogin)
      window.document.removeEventListener('keydown', showLogin)
    }
  }, [loading])

  return (
    <>
      <LoadingScreen setLoading={setLoading} />

      <div className='login'>
        <section className='login__timestamp' ref={timestamp}>
          <p className='login__timestamp-format'>
            <span className='login__timestamp-hour' ref={hour} />
            <span className='login__timestamp-period' ref={period} />
          </p>
          <p className='login__timestamp-date' ref={date} />
        </section>

        <section className='login-form' ref={form}>
          <div className='login-form__logo'>
            <img src={logoSena} alt='Logo SENA' />
          </div>
          <form onSubmit={handleSubmit} ref={formRef}>
            <input
              className='login-form__input'
              type='number'
              placeholder='Número de documento'
              name='documento'
              required
            />
            <input
              className='login-form__input'
              type='password'
              placeholder='Contraseña'
              name='contrasena'
              required
            />
            {error && <div className='login-form__error'>{error}</div>}
            <button className='login-form__button' type='submit'>Ingresar</button>
          </form>
        </section>
      </div>
    </>
  )
}
