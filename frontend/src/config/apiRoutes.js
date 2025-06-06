export const API_BASE = 'http://localhost/sgi-proyectoformativo/backend'

export const IniciarSesionEndpoint = `${API_BASE}/aspectos_generales/login/controllers/sessionValidate.php`

export const SaveElementsEndpoint = `${API_BASE}/elementos/api/guardarAPI.php`
export const FetchElementsEndpoint = `${API_BASE}/elementos/api/obtenerAPI.php`
export const FetchElementByCodeEndpoint = `${API_BASE}/elementos/api/obtenerAPI.php?codigo=`
export const UpdateElementsEndpoint = `${API_BASE}/elementos/api/editarAPI.php`
export const DeactivateElementsEndPoint = `${API_BASE}/elementos/api/deshabilitarAPI.php`

export const ObtenerRolesEndpoint = `${API_BASE}/aspectos_generales/roles/api/obtenerAPI.php`
export const ObtenerRolPorIDEndpoint = `${API_BASE}/aspectos_generales/roles/api/obtenerAPI.php?rol_id=`
export const GuardarRolEndpoint = `${API_BASE}/aspectos_generales/roles/api/guardarAPI.php`
export const EditarRolEndpoint = `${API_BASE}/aspectos_generales/roles/api/editarAPI.php`
export const DesactivarRolEndpoint = `${API_BASE}/aspectos_generales/roles/api/desactivarAPI.php`
export const ObtenerPermisosEndpoint = `${API_BASE}/aspectos_generales/permisos/api/obtenerAPI.php`

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
