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
