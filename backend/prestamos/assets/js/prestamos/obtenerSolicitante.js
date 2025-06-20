document.addEventListener('DOMContentLoaded', function() {
    const identificacionInput = document.getElementById('identificacion');
    
    if (identificacionInput) {
        identificacionInput.addEventListener('blur', function () {
            const identificacion = this.value;
        
            if (identificacion.length >= 1) {
                fetch(`http://localhost/SGI-ProyectoFormativo/backend/prestamos/api/obtenerSolicitante.php?identificacion=${identificacion}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success && data.solicitante) {
                            document.getElementById('nombre_apellido').value = data.solicitante.solicitante_nombre;
                            document.getElementById('correo').value = data.solicitante.solicitante_correo;
                            document.getElementById('telefono').value = data.solicitante.solicitante_telefono;
                            document.getElementById('direccion').value = data.solicitante.solicitante_direccion;
                        }
                    })
                    .catch(error => console.error('Error:', error));
            }
        });
    }
});