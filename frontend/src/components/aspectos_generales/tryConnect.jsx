/**
 * Función para realizar la autenticación del usuario
 * @param {string} document - Numero de documento del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} - Respuesta de la autenticación
 */
const tryConnect = async (document, password) => {
    try {
    const apiUrl = "http://localhost/SGI-ProyectoFormativo/backend/aspectos_generales/controllers/sessionValidate.php";

    // Crear formato JSON de la petición
    const requestData = {
        document: document,
        password: password
    };

    console.log("Intentando conexion a:", apiUrl);
    console.log("Con la data:", requestData);

    // Crear petición POST a la API
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
        body: JSON.stringify(requestData),
        credentials: 'include', // Incluir cookies para la gestión de la sesión
        mode: 'cors' // Add CORS mode
    });

    // Parsear la respuesta JSON
    const data = await response.json();

    // Comprobar si la autenticación fue exitosa
    if (data.status === "success") {
      // Almacenar el estado de autenticación en localStorage
        localStorage.setItem("isAuthenticated", "true");
        if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
        }
    return { success: true, message: data.message };
    } else {
    return {
        success: false,
        message: data.message || "Credenciales inválidas",
    };
    }
} catch (error) {
    console.error("Authentication error:", error);
    // Error de conexión con el servidor
    return { 
        success: false, 
        message: `Error de conexión con el servidor: ${error.message}. Verifique que el servidor esté en funcionamiento.` 
    };
}
};

export default tryConnect;
