export const API_BASE = 'http://localhost/sgi-proyectoformativo/backend'

export const IniciarSesionEndpoint = `${API_BASE}/aspectos_generales/login/api/sessionValidate.php`

export const SaveElementsEndpoint = `${API_BASE}/elementos/api/guardarAPI.php`
export const FetchElementsEndpoint = `${API_BASE}/elementos/api/obtenerAPI.php`
export const FetchElementByCodeEndpoint = `${API_BASE}/elementos/api/obtenerAPI.php?codigo=`
export const UpdateElementsEndpoint = `${API_BASE}/elementos/api/editarAPI.php`
export const DeactivateElementsEndPoint = `${API_BASE}/elementos/api/deshabilitarAPI.php`

export const ObtenerUsuariosEndpoint = `${API_BASE}/usuarios/api/obtenerAPI.php`
export const ObtenerUsuarioPorCodigoEndpoint = `${API_BASE}/usuarios/api/obtenerAPI.php?documento=`
export const GuardarUsuarioEndpoint = `${API_BASE}/usuarios/api/guardarAPI.php`
export const EditarUsuarioEndpoint = `${API_BASE}/usuarios/api/editarAPI.php`
export const DesactivarUsuarioEndpoint = `${API_BASE}/usuarios/api/desactivarAPI.php`

export const ObtenerRolesEndpoint = `${API_BASE}/aspectos_generales/roles/api/obtenerAPI.php`
export const ObtenerRolPorIDEndpoint = `${API_BASE}/aspectos_generales/roles/api/obtenerAPI.php?rol_id=`
export const GuardarRolEndpoint = `${API_BASE}/aspectos_generales/roles/api/guardarAPI.php`
export const EditarRolEndpoint = `${API_BASE}/aspectos_generales/roles/api/editarAPI.php`
export const DesactivarRolEndpoint = `${API_BASE}/aspectos_generales/roles/api/desactivarAPI.php`
export const ObtenerPermisosEndpoint = `${API_BASE}/aspectos_generales/permisos/api/obtenerAPI.php`
export const ObtenerPermisosPorRolEndpoint = `${API_BASE}/aspectos_generales/permisos/api/obtenerAPI.php?rol=`

export const ObtenerAreasEndpoint = `${API_BASE}/aspectos_generales/areas/api/obtenerAPI.php`
export const ObtenerAreaPorCodigoEndpoint = `${API_BASE}/aspectos_generales/areas/api/obtenerAPI.php?area_id=`
export const GuardarAreaEndpoint = `${API_BASE}/aspectos_generales/areas/api/guardarAPI.php`
export const EditarAreaEndpoint = `${API_BASE}/aspectos_generales/areas/api/editarAPI.php`
export const DesactivarAreaEndpoint = `${API_BASE}/aspectos_generales/areas/api/desactivarAPI.php`

export const ObtenerCategoriasEndpoint = `${API_BASE}/aspectos_generales/categorias/api/obtenerAPI.php`
export const ObtenerCategoriaPorCodigoEndpoint = `${API_BASE}/aspectos_generales/categorias/api/obtenerAPI.php?categoria_id=`
export const GuardarCategoriaEndpoint = `${API_BASE}/aspectos_generales/categorias/api/guardarAPI.php`
export const EditarCategoriaEndpoint = `${API_BASE}/aspectos_generales/categorias/api/editarAPI.php`
export const DesactivarCategoriaEndpoint = `${API_BASE}/aspectos_generales/categorias/api/desactivarAPI.php`

export const ObtenerMarcasEndpoint = `${API_BASE}/aspectos_generales/marcas/api/obtenerAPI.php`
export const ObtenerMarcaPorCodigoEndpoint = `${API_BASE}/aspectos_generales/marcas/api/obtenerAPI.php?marca_id=`
export const GuardarMarcaEndpoint = `${API_BASE}/aspectos_generales/marcas/api/guardarAPI.php`
export const EditarMarcaEndpoint = `${API_BASE}/aspectos_generales/marcas/api/editarAPI.php`
export const DesactivarMarcaEndpoint = `${API_BASE}/aspectos_generales/marcas/api/desactivarAPI.php`

export const ObtenerTipoDocumentoEndpoint = `${API_BASE}/aspectos_generales/tipoDocumento/api/obtenerAPI.php`
export const ObtenerTipoDocumentoPorCodigoEndpoint = `${API_BASE}/aspectos_generales/tipoDocumento/api/obtenerAPI.php?tipo_documento_id=`
export const GuardarTipoDocumentoEndpoint = `${API_BASE}/aspectos_generales/tipoDocumento/api/guardarAPI.php`
export const EditarTipoDocumentoEndpoint = `${API_BASE}/aspectos_generales/tipoDocumento/api/editarAPI.php`
export const DesactivarTipoDocumentoEndpoint = `${API_BASE}/aspectos_generales/tipoDocumento/api/desactivarAPI.php`

export const ObtenerPrestamosEndpoint = `${API_BASE}/prestamos/api/obtenerAPI.php`
export const ObtenerPrestamoPorCodigoEndpoint = `${API_BASE}/prestamos/api/obtenerAPI.php?prestamo_id=`
export const GuardarPrestamoEndpoint = `${API_BASE}/prestamos/api/generarPrestamo.php`
export const EditarObservacionPrestamo = `${API_BASE}/prestamos/api/editarObservacion.php`
export const CambiarEstadoPrestamo = `${API_BASE}/prestamos/api/cambiarEstadoPrestamo.php?estado=`
export const DesactivarPrestamoEndpoint = `${API_BASE}/prestamos/api/inhabilitarPrestamo.php`

export const ObtenerSolicitantesEndpoint = `${API_BASE}/solicitantes/api/obtenerAPI.php`
export const ObtenerSolicitantesPorDocumentoEndpoint = `${API_BASE}/solicitantes/api/obtenerAPI.php?documento=`

export const CuentaElementosPrestados = `${API_BASE}/reportes/api/cuentaElementosPrestados.php`
export const CuentaPrestamosUsuario = `${API_BASE}/reportes/api/cuentaPrestamosUsuario.php`

export const DescargarPlantilla = `${API_BASE}/cargamasiva/api/descargar_plantilla.php`
export const SubirArchivo = `${API_BASE}/cargamasiva/api/subir_archivo.php`
export const ComprobarArchivo = `${API_BASE}/cargamasiva/api/comprobar_datos.php`
export const CargarArchivo = `${API_BASE}/cargamasiva/api/cargar_datos.php`
