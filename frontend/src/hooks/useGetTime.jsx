import { useRef } from 'react'

export default function useGetTime () {
  const hour = useRef(null)
  const period = useRef(null)
  const date = useRef(null)

  const getTime = () => {
    const hourRef = hour.current
    const periodRef = period.current
    const dateRef = date.current

    if (!hourRef || !periodRef) return

    const fecha = new Date()

    // Obtener la hora en formato de 12 horas
    let hora = fecha.getHours()
    const minutos = fecha.getMinutes().toString().padStart(2, '0')

    // Determinar si es AM o PM
    const periodo = hora >= 12 ? 'PM' : 'AM'

    hora = hora % 12 // 0 -> 12, 1 -> 1, ..., 13 -> 1, 14 -> 2, ...
    hora = hora || 12 // El 0 debe mostrarse como 12 en formato de 12 horas

    // Formatear la hora
    const horaFormateada = hora.toString().padStart(1, '0') + ':' + minutos

    // Obtener los nombres de los días y meses
    const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

    const nombreDia = diasSemana[fecha.getDay()]
    const dia = fecha.getDate()
    const nombreMes = meses[fecha.getMonth()]

    const fechaFormateada = `${nombreDia}, ${dia} de ${nombreMes}`

    // Colocar la hora y la fecha en los divs correspondientes
    hourRef.textContent = horaFormateada
    periodRef.textContent = periodo
    dateRef.textContent = fechaFormateada
  }

  setInterval(getTime, 1000)

  return { hour, period, date }
}
