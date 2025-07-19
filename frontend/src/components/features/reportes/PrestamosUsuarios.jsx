import { useFetch } from '../../../hooks/commonHooks/useFetch'
import '../../../styles/globals/lists.css'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function PrestamosUsuarios ({ setAlert }) {
  const { allElements: elements } = useFetch({
    setAlert,
    windowHeight: null,
    isMaximized: null,
    obtener: 'prestamosUsuarios'
  })

  const filteredElements = elements.slice(0, 5)

  return (
    <>
      <span className='title'>Usuarios con más prestamos</span>

      <div className='grafico-container' style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={filteredElements}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid stroke='#39A90050' strokeDasharray='3 3' />
            <XAxis
              dataKey='documento'
              label={{ value: 'Documento del usuario', position: 'outsideBottom', dy: 30 }}
              stroke='#00304D'
              interval={0} // muestra todas las etiquetas, sin omitir
            />
            <YAxis
              label={{ value: 'Veces Prestado', angle: -90, position: 'outsideLeft', dx: -10 }}
              allowDecimals={false} // <== evita decimales
              stroke='#00304D'
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey='cantidad_prestamos' fill='#39A900' label='hola' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <span className='title'>Todos los usuarios</span>

      {elements.map((element) => (
        <Info
          key={element.documento}
          label={`${element.documento} - ${element.nombre} ${element.apellido}`}
          value={`Cantidad de prestamos: ${element.cantidad_prestamos}`}
        />
      ))}
    </>
  )
}

function Info ({ label, value }) {
  return (
    <div className='element-info'>
      <span className='element-info__title'>{label}</span>
      <span className='element-info__content'>{value}</span>
    </div>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload

    return (
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
        color: '#00304D'
      }}
      >
        <p><strong>Documento:</strong> {data.documento}</p>
        <p><strong>Nombre:</strong> {`${data.nombre} ${data.apellido}`}</p>
        <p><strong>Cantidad de prestamos:</strong> {data.cantidad_prestamos}</p>
      </div>
    )
  }

  return null
}
