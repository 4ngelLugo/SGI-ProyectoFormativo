import { useFetch } from '../../../hooks/commonHooks/useFetch'
import '../../../styles/globals/lists.css'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function ElementosPrestados ({ setAlert }) {
  const { allElements: elements } = useFetch({
    setAlert,
    windowHeight: null,
    isMaximized: null,
    obtener: 'elementosPrestados'
  })

  const filteredElements = (elements ?? []).slice(0, 5)

  return (
    <>
      <span className='title'>Elementos más prestados</span>

      <div className='grafico-container' style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={filteredElements}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid stroke='#39A90050' strokeDasharray='3 3' />
            <XAxis
              dataKey='codigo'
              label={{ value: 'Codigo del Elemento', position: 'outsideBottom', dy: 30 }}
              stroke='#00304D'
              interval={0} // muestra todas las etiquetas, sin omitir
            />
            <YAxis
              label={{ value: 'Veces Prestado', angle: -90, position: 'outsideLeft', dx: -10 }}
              allowDecimals={false} // <== evita decimales
              stroke='#00304D'
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey='veces_prestados' fill='#39A900' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <span className='title'>Todos los elementos</span>

      {elements && elements.map((element) => (
        <Info
          key={element.codigo}
          label={`${element.codigo} - ${element.nombre}`}
          value={`Veces Prestado: ${element.veces_prestados}`}
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
        <p><strong>Código:</strong> {data.codigo}</p>
        <p><strong>Nombre:</strong> {data.nombre}</p>
        <p><strong>Veces prestado:</strong> {data.veces_prestados}</p>
      </div>
    )
  }

  return null
}
