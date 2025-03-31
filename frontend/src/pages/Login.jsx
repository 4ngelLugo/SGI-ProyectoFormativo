import '../styles/login.css'
import LoadingScreen from '../components/LoadingScreen'
import useGetTime from '../hooks/useGetTime'
import logoSena from '../assets/images/logoSena.png'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

export default function Login () {
  const [loading, setLoading] = useState(true)
  const { hour, period, date } = useGetTime()
  const timestamp = useRef(null)
  const form = useRef(null)
  const navigate = useNavigate()

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

    document.addEventListener('click', showLogin)
    document.addEventListener('keydown', showLogin)

    return () => {
      document.removeEventListener('click', showLogin)
      document.removeEventListener('keydown', showLogin)
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
          <form action={() => navigate('/desktop')}>
            <input className='login-form__input' type='number' placeholder='Número de documento' />
            <input className='login-form__input' type='password' placeholder='Contraseña' />
            <button type='submit' />
          </form>
        </section>
      </div>
    </>
  )
}
