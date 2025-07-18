<?php
require_once '../model/CM_Model.php';

class CM_Controller {
    private $model;

    public function __construct() {
        $this->model = new CM_Model();
    }

    public function procesarArchivoCSV($rutaArchivo) {
        try {
            // Leer el archivo CSV
            $datos = [];
            $encabezados = [];
            $filaNumero = 0;

            if (($handle = fopen($rutaArchivo, 'r')) !== false) {
                while (($data = fgetcsv($handle, 1000, ',')) !== false) {
                    $filaNumero++;
                    
                    if ($filaNumero === 1) {
                        // Primera fila son los encabezados
                        $encabezados = array_map('trim', $data);
                        $this->validarEncabezados($encabezados);
                    } else {
                        // Crear array asociativo con los datos
                        if (count($data) === count($encabezados)) {
                            $fila = [];
                            for ($i = 0; $i < count($encabezados); $i++) {
                                $fila[$encabezados[$i]] = trim($data[$i]);
                            }
                            
                            // Validar datos básicos de la fila
                            $erroresValidacion = $this->validarFilaBasica($fila);
                            if (empty($erroresValidacion)) {
                                $datos[] = $fila;
                            } else {
                                throw new Exception("Error en fila $filaNumero: " . implode(', ', $erroresValidacion));
                            }
                        } else {
                            throw new Exception("Error en fila $filaNumero: número de columnas incorrecto");
                        }
                    }
                }
                fclose($handle);
            } else {
                throw new Exception('No se pudo abrir el archivo CSV');
            }

            if (empty($datos)) {
                throw new Exception('El archivo CSV está vacío o no contiene datos válidos');
            }

            return [
                'success' => true,
                'datos' => $datos,
                'message' => 'Archivo procesado exitosamente'
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    private function validarEncabezados($encabezados) {
        $encabezadosRequeridos = [
            'elemento_codigo',
            'elemento_nombre',
            'elemento_tipo',
            'categoria_id',
            'area_id',
            'elemento_placa',
            'elemento_serial',
            'marca_id',
            'elemento_modelo',
            'elemento_cantidad',
            'elemento_und_medida',
            'estado_elemento_id'
        ];

        foreach ($encabezadosRequeridos as $requerido) {
            if (!in_array($requerido, $encabezados)) {
                throw new Exception("Encabezado requerido '$requerido' no encontrado");
            }
        }
    }

    private function validarFilaBasica($fila) {
        $errores = [];

        // Validar campos requeridos
        if (empty($fila['elemento_codigo'])) {
            $errores[] = 'Código de elemento es requerido';
        }

        if (empty($fila['elemento_nombre'])) {
            $errores[] = 'Nombre de elemento es requerido';
        }

        if (empty($fila['elemento_tipo'])) {
            $errores[] = 'Tipo de elemento es requerido';
        }

        // Validar que los IDs sean números enteros
        $camposID = ['categoria_id', 'area_id', 'marca_id', 'estado_elemento_id'];
        foreach ($camposID as $campo) {
            if (!empty($fila[$campo]) && !is_numeric($fila[$campo])) {
                $errores[] = "$campo debe ser un número entero";
            }
        }

        // Validar cantidad
        if (!empty($fila['elemento_cantidad']) && !is_numeric($fila['elemento_cantidad'])) {
            $errores[] = 'Cantidad debe ser un número';
        }

        // Validar longitud de campos
        if (strlen($fila['elemento_codigo']) > 50) {
            $errores[] = 'Código de elemento no puede exceder 50 caracteres';
        }

        if (strlen($fila['elemento_nombre']) > 255) {
            $errores[] = 'Nombre de elemento no puede exceder 255 caracteres';
        }

        return $errores;
    }

    public function comprobarDatos($datos) {
        try {
            $duplicadosBD = [];
            $errores = [];

            foreach ($datos as $index => $fila) {
                // Verificar si el código ya existe en la base de datos
                if ($this->model->existeElemento($fila['elemento_codigo'])) {
                    $duplicadosBD[] = $index;
                }

                // Verificar claves foráneas
                $erroresFK = $this->verificarClavesForeanas($fila);
                if (!empty($erroresFK)) {
                    $errores[$index] = $erroresFK;
                }
            }

            return [
                'success' => true,
                'duplicados_bd' => $duplicadosBD,
                'errores' => $errores,
                'message' => 'Verificación completada'
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    private function verificarClavesForeanas($fila) {
        $errores = [];

        // Verificar categoria_id
        if (!empty($fila['categoria_id']) && !$this->model->existeCategoria($fila['categoria_id'])) {
            $errores[] = "Categoría ID {$fila['categoria_id']} no existe";
        }

        // Verificar area_id
        if (!empty($fila['area_id']) && !$this->model->existeArea($fila['area_id'])) {
            $errores[] = "Área ID {$fila['area_id']} no existe";
        }

        // Verificar marca_id
        if (!empty($fila['marca_id']) && !$this->model->existeMarca($fila['marca_id'])) {
            $errores[] = "Marca ID {$fila['marca_id']} no existe";
        }

        // Verificar estado_elemento_id
        if (!empty($fila['estado_elemento_id']) && !$this->model->existeEstadoElemento($fila['estado_elemento_id'])) {
            $errores[] = "Estado elemento ID {$fila['estado_elemento_id']} no existe";
        }

        return $errores;
    }

    public function guardarElementos($datos) {
        try {
            $insertados = 0;
            $errores = [];

            foreach ($datos as $index => $fila) {
                try {
                    if ($this->model->insertarElemento($fila)) {
                        $insertados++;
                    }
                } catch (Exception $e) {
                    $errores[$index] = $e->getMessage();
                }
            }

            return [
                'success' => true,
                'insertados' => $insertados,
                'errores' => $errores,
                'message' => "$insertados elementos insertados exitosamente"
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}