import { useEffect, useRef, useState } from 'react'

export default function TooltipCell ({ text }) {
  // Estado para manejar el overflow del texto
  const [isOverflowed, setIsOverflowed] = useState(false)

  // Referencia al elemento del texto
  const textRef = useRef(null)

  useEffect(() => {
    const element = textRef.current
    if (element) {
      // ScrollWidth es el ancho del contenido
      // ClientWidth es el ancho del elemento visible
      // Si el ancho del contenido es mayor al ancho visible, significa que hay un overflow
      setIsOverflowed(element.scrollWidth > element.clientWidth)
    }
  }, [text])

  return (
    <td>
      <div className='tooltip-container'>
        <p className='td-text' ref={textRef}>{text}</p>
        {/* Si hay overflow se renderiza el tooltip */}
        {isOverflowed && <span className='tooltip'>{text}</span>}
      </div>
    </td>
  )
}
