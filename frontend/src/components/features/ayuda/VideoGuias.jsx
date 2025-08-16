import { useState } from "react"
import { Icon } from '@iconify/react'

export default function VideoGuias() {
  const [video, setVideo] = useState(null)

  // Lista de guías en un solo arreglo
  const guias = [
    { label: "Elementos", file: "/videos/Ventana elementos guia.mp4" },
    { label: "Usuarios", file: "/videos/Ventana usuarios guia.mp4" },
    { label: "Préstamos", file: "/videos/Ventana prestamos guia.mp4" },
    { label: "Roles", file: "/videos/Ventana roles guia.mp4" },
    { label: "Configuración", file: "/videos/Ventana configuracion guia.mp4" }
  ]

  return (
    <>
      <span className="title">Video guías</span>

      <div className="videoBotones">
        {guias.map((guia, index) => (
          <button
            key={index}
            type="button"
            className="botonVideo"
            onClick={() => setVideo(guia.file)}
          >
            <Icon icon="tabler:video" width="24" strokeWidth={1} />
            <span>{guia.label}</span>
          </button>
        ))}
      </div>

      <div className="videoContainer">
        {video ? (
          <video key={video} controls width="100%">
            <source src={video} type="video/mp4" />
            Tu navegador no soporta la reproducción de video.
          </video>
        ) : (
          <p>Selecciona una guía para reproducir el video</p>
        )}
      </div>

    </>
  )
}
