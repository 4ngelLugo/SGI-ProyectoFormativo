import '../styles/login.css'
import LoadingScreen from '../components/LoadingScreen'
import useGetTime from '../hooks/useGetTime'
import logoSena from '../assets/images/logoSena.png'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { tryConnect } from '../components/aspectos_generales/tryConnect';

export default function Login () {
  const [loading, setLoading] = useState(true)
  const { hour, period, date } = useGetTime()
  const timestamp = useRef(null)
  const form = useRef(null)
  const navigate = useNavigate()
  const [documentNumber, setDocumentNumber] = useState('') // 
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    try {
      const response = await tryConnect(documentNumber, password)
      if (response.success) {
        navigate('/desktop')
      } else {
        setError(response.message || 'Error de autenticación')
      }
    } catch (err) {
      setError('Error de conexión. Intente nuevamente.')
      console.error(err)
    }
  }

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
          <form onSubmit={handleSubmit}>
            <input 
              className='login-form__input' 
              type='number' 
              placeholder='Número de documento' 
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              required
            />
            <input 
              className='login-form__input' 
              type='password' 
              placeholder='Contraseña' 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div className="login-form__error">{error}</div>}
            <button type='submit'>Ingresar</button>
          </form>
        </section>
      </div>
    </>
  )
}
