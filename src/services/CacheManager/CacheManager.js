class CacheManager {
    constructor(api) {
        this.api = api // Se guarda la referencia al objeto api proporcionado
        this.cache = {} // Objeto para almacenar las cachés de diferentes tipos de datos
        this.promises = {} // Objeto para almacenar las promesas pendientes de cada tipo de datos
    }

    obtenerDatos(tipo, url) {
        return new Promise((resolve, reject) => {
            // Verificar si hay datos en caché para este tipo
            if (this.cache[tipo] && this.cache[tipo].data) {
                resolve(this.cache[tipo].data)
                return
            }

            // Verificar si ya hay una promesa pendiente para este tipo de datos
            if (this.promises[tipo]) {
                // Si hay una promesa pendiente, agregar esta nueva resolución a la lista de resoluciones pendientes
                this.promises[tipo].push({ resolve, reject })
                return
            }

            // Si no hay datos en caché y no hay una promesa pendiente, realizar la solicitud a la API
            this.promises[tipo] = [{ resolve, reject }]

            this.api.get(url) // Llamar al método 'get' del objeto api proporcionado
                .then((res) => {
                    // Guardar el resultado en caché para este tipo
                    this.cache[tipo] = {
                        data: res.data,
                        timer: setTimeout(() => {
                            // Limpiar la caché después de 1 segundo
                            delete this.cache[tipo]
                        }, 1000) // 1000 milisegundos = 1 segundo
                    }

                    // Resolver todas las promesas pendientes para este tipo de datos con el mismo resultado
                    this.promises[tipo].forEach(({ resolve }) => resolve(res.data))
                    delete this.promises[tipo] // Limpiar la lista de promesas pendientes
                })
                .catch((err) => {
                    // Rechazar todas las promesas pendientes para este tipo de datos con el mismo error
                    this.promises[tipo].forEach(({ reject }) => reject(err))
                    delete this.promises[tipo] // Limpiar la lista de promesas pendientes
                })
        })
    }
}

export default CacheManager
