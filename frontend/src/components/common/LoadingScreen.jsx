import { useEffect, useRef } from 'react'
import placeholderIcon from '../../assets/images/placeholderIcon.jpg'

export default function LoadingScreen ({ setLoading }) {
  const loadingScreen = useRef()
  const loadingBar = useRef()

  const fadeOut = () => {
    if (!loadingScreen.current) return

    loadingScreen.current.style.opacity = 0
    setTimeout(() => {
      setLoading(false)
      loadingScreen.current.style.display = 'none'
    }, 1000)
  }

  useEffect(() => {
    const bar = loadingBar.current
    if (!bar) return

    bar.addEventListener('animationend', fadeOut)

    return () => {
      bar.removeEventListener('animationend', fadeOut)
    }
  }, [])

  return (
    <>
      <section className='loading-screen' ref={loadingScreen}>
        <div className='loading-screen__logo'>
          <img src={placeholderIcon} alt='Ícono de macOS' />
        </div>

        <div className='loading-screen__bar'>
          <div className='loading-screen__bar-fill' ref={loadingBar} />
        </div>
      </section>
    </>
  )
}
