import { useEffect, useState } from "react";
import { FetchElementByCodeEndpoint } from "../../config/apiRoutes";

export default function SeeElements({ setAlert, searchElement }) {
  const [element, setElement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchCode, setSearchCode] = useState(searchElement);
  const [typing, setTyping] = useState(false);

  const fetchElement = async (code) => {
    try {
      const res = await fetch(`${FetchElementByCodeEndpoint}${code}`)
      const response = await res.json()

      if (response.error) {
        setAlert({ type: "error", message: response.error })
        setElement(null)
      } else {
        setElement(response)
      }
    } catch (error) {
      setAlert({ type: "error", message: "Error al buscar el elemento", active: true })
      setElement(null)
      setTyping(false);
    }
  };

  useEffect(() => {
    if (!searchCode) {
      setElement(null);
      setLoading(false);
      setTyping(false);
      return;
    }

    setTyping(true);
    setLoading(true);

    const timer = setTimeout(async () => {
      setTyping(false);
      await fetchElement(searchCode);
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [searchCode]);

  return (
    <>
      <span className="title see-title">
        Ver elemento
        <div className="search-input">
          <span>Código</span>
          <input
            type="text"
            value={searchCode || ''}
            placeholder="Código"
            onChange={(e) => {
              const value = e.target.value;
              setSearchCode(value);
              if (value.trim() === "") {
                setElement(null);
                setLoading(false);
              }
            }}
            className="input"
          />
        </div>
      </span>

      {loading ? (
        <p>Cargando...</p>
      ) : element && element.tipo === 'devolutivo' ? (
        <div className="element-info__container">
          <Info label="Nombre" value={element.nombre} />
          <Info label="Placa" value={element.placa} />
          <Info label="Marca" value={element.marca} />
          <Info label="Modelo" value={element.modelo} />
          <Info label="Serial" value={element.serial} />
          <Info label="Área" value={element.area} />
          <Info label="Tipo" value={element.tipo} />
          <Info label="Estado" value={element.estado} />
        </div>
      ) : element && element.tipo === 'consumible' ? (
        <div className="element-info__container">
          <Info label="Nombre" value={element.nombre} />
          <Info label="Cantidad" value={`${element.cantidad} ${element.medida}`} />
          <Info label="Área" value={element.area} />
          <Info label="Tipo" value={element.tipo} />
          <Info label="Estado" value={element.estado} />
        </div>
      ) : (
        !typing && <p>No se encontró el elemento.</p>
      )}
    </>
  );
}

function Info({ label, value }) {
  return (
    <div className="element-info">
      <span className="element-info__title">{label}</span>
      <span className="element-info__content">{value}</span>
    </div>
  );
}
