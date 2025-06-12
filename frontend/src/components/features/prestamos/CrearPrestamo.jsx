import { useEffect, useState } from 'react'
import Select from 'react-select'
import { useFetch } from '../../../hooks'
import '../../../styles/tablaPrestamos.css'

export default function CrearPrestamo({ setAlert }) {
  const [devolutivos, setDevolutivos] = useState([]);
  const [consumibles, setConsumibles] = useState([]);
  const [seleccionadosDevolutivos, setSeleccionadosDevolutivos] = useState([]);
  const [seleccionadosConsumibles, setSeleccionadosConsumibles] = useState([]);

  const {
    elements,
  } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'elementos' });

  useEffect(() => {
    const consumiblesData = elements.filter(e => e.tipo === 'consumible');
    const devolutivaData = elements.filter(e => e.tipo === 'devolutivo');
    const consumibleopciones = consumiblesData.map(e => ({
      value: e.codigo,
      label: e.nombre,
      data: e,
    }));
    const devolutivoOpciones = devolutivaData.map(e => ({
      value: e.codigo,
      label: e.nombre,
      data: e,
    }));

    setConsumibles(consumibleopciones);
    setDevolutivos(devolutivoOpciones);
  }, [elements]);

  const handleChangeDevolutivos = (selectedOptions) => {
    const datos = selectedOptions.map(opt => opt.data);
    setSeleccionadosDevolutivos(datos);
  };

  const handleChangeConsumibles = (selectedOptions) => {
    const datos = selectedOptions.map(opt => opt.data);
    setSeleccionadosConsumibles(datos);
  };

  return (
    <>
      <span className='title'>Solicitar Prestamo</span>
      <form className='form'>
        <section className='prestamo-solicitante'>
          <h3 className='prestamo-seccion-titulo'>Información del solicitante</h3>
          <input type='number' placeholder='Documento del solicitante' name='identificacion' className='prestamo-input' />
          <input type='text' placeholder='Nombre y apellido del solicitante' name='nombre_apellido' className='prestamo-input' />
          <input type='tel' placeholder='Teléfono del solicitante' name='telefono' className='prestamo-input' />
          <input type='email' placeholder='Correo del solicitante' name='correo' className='prestamo-input' />
          <div className='prestamo-fechas'>
            <div>
              <label htmlFor='entrega' className='prestamo-label'>Fecha de entrega</label>
              <input type='date' name='fecha_entrega' id='entrega' className='prestamo-input' />
            </div>
            <div>
              <label htmlFor='devolucion' className='prestamo-label'>Fecha de devolución</label>
              <input type='date' name='fecha_devolucion' id='devolucion' className='prestamo-input' />
            </div>
          </div>
          <input type='text' placeholder='Destino de los elementos' name='destino_general' className='prestamo-input' />
        </section>

        <section className='prestamo-consumibles'>
          <h3 className='prestamo-seccion-titulo'>Seleccionar devolutivos</h3>
          <Select
            options={devolutivos}
            isMulti
            onChange={handleChangeDevolutivos}
            className="prestamo-select"
            placeholder="Buscar devolutivos..."
            menuPortalTarget={document.body}
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 }),
              menu: base => ({ ...base, zIndex: 9999 })
            }}
          />
          <div className='prestamo-elementos'>
            {seleccionadosDevolutivos.map(data => (
              <div key={data.codigo} className='prestamo-elemento'>
                <span className='prestamo-info__codigo'>{data.codigo}</span>
                <span className='prestamo-info__nombre'>{data.nombre}</span>

                <input
                  type="number"
                  name={`consumibles[${data.codigo}][cantidad]`}
                  placeholder='Cantidad'
                  min="1"
                  max={data.cantidad}
                  className='prestamo-cantidad-input'
                />
                <div className='prestamo-stock'>
                  <label className='prestamo-label'>Cantidad disponible: </label>
                  <span>{data.cantidad}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className='prestamo-consumibles'>
          <h3 className='prestamo-seccion-titulo'>Seleccionar consumibles</h3>
          <Select
            options={consumibles}
            isMulti
            onChange={handleChangeConsumibles}
            className="prestamo-select"
            placeholder="Buscar consumibles..."
            menuPortalTarget={document.body}
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 }),
              menu: base => ({ ...base, zIndex: 9999 })
            }}
          />
          <div className='prestamo-elementos'>
            {seleccionadosConsumibles.map(data => (
              <div key={data.codigo} className='prestamo-elemento'>
                <span className='prestamo-info__codigo'>{data.codigo}</span>
                <span className='prestamo-info__nombre'>{data.nombre}</span>

                <input
                  type="number"
                  name={`consumibles[${data.codigo}][cantidad]`}
                  placeholder='Cantidad'
                  min="1"
                  max={data.cantidad}
                  className='prestamo-cantidad-input'
                />
                <div className='prestamo-stock'>
                  <label className='prestamo-label'>Cantidad disponible: </label>
                  <span>{data.cantidad}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <button className='form__button' type='submit'>Enviar</button>
      </form>
    </>
  )
}