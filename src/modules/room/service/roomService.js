import axios from "axios"
import vuex from "@/store"

/**
 * Objeto LOCAL para gestionar las solicitudes y configuración de la API de reservas.
 * @namespace LOCAL
 * @type {Object}
 */
const LOCAL = {
    /**
     * Configura Axios con la URL base de la API de reservas y el token de autorización.
     * @memberof LOCAL
     * @function Axios
     */
    Axios() {
        LOCAL.api = axios.create({
            baseURL: process.env.VUE_APP_URL_BASE + "/api",
            headers: {
                Authorization: `Bearer ${vuex.state.token}`
            },
        })
    }
}

/**
 * Servicio para realizar operaciones relacionadas con las habitaciones utilizando la API externa.
 * @namespace roomService
 * @type {Object}
 */
const roomService = {

    /**
     * Crea una nueva habitación mediante una solicitud POST a la API.
     * @function
     * @memberof RoomService
     * @param {FormData} data - Datos de la habitación a crear, incluyendo archivos si es necesario.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    crearRoom(data) {
        let url = 'room/create'

        let config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }

        return new Promise((resolve, reject) => {
            LOCAL.api.post(url, data, config)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Obtiene todas las habitaciones mediante una solicitud GET a la API.
     * @function
     * @memberof RoomService
     * @returns {Promise} Promesa que se resuelve con la lista de habitaciones o se rechaza con un error.
     */
    obtenerRooms() {
        let url = 'room/read'

        return new Promise((resolve, reject) => {
            LOCAL.api.get(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Actualiza una habitación existente mediante una solicitud PATCH a la API.
     * @function
     * @memberof RoomService
     * @param {FormData} data - Datos actualizados de la habitación.
     * @param {number} id - Identificador único de la habitación a actualizar.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    actualizarRoom(data, id) {
        let url = `room/update/${id}`

        return new Promise((resolve, reject) => {
            LOCAL.api.patch(url, data)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Elimina una habitación existente mediante una solicitud DELETE a la API.
     * @function
     * @memberof RoomService
     * @param {number} id - Identificador único de la habitación a eliminar.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    eliminarRoom(id) {
        let url = `room/delete/${id}`

        return new Promise((resolve, reject) => {
            LOCAL.api.delete(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Crea un nuevo tipo de habitación mediante una solicitud POST a la API.
     * @function
     * @memberof RoomService
     * @param {Object} data - Datos del tipo de habitación a crear.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    crearTipoRoom(data) {
        let url = 'room/type/create'

        return new Promise((resolve, reject) => {
            LOCAL.api.post(url, data)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Obtiene todos los tipos de habitaciones mediante una solicitud GET a la API.
     * @function
     * @memberof RoomService
     * @returns {Promise} Promesa que se resuelve con la lista de tipos de habitaciones o se rechaza con un error.
     */
    obtenerTiposRoom() {
        let url = 'room/type'

        return new Promise((resolve, reject) => {
            LOCAL.api.get(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Actualiza un tipo de habitación existente mediante una solicitud PATCH a la API.
     * @function
     * @memberof RoomService
     * @param {Object} data - Datos actualizados del tipo de habitación.
     * @param {number} id - Identificador único del tipo de habitación a actualizar.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    actualizarTipoRoom(data, id) {
        let url = `room/type/update/${id}`

        return new Promise((resolve, reject) => {
            LOCAL.api.patch(url, data)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Elimina un tipo de habitación existente mediante una solicitud DELETE a la API.
     * @function
     * @memberof RoomService
     * @param {number} id - Identificador único del tipo de habitación a eliminar.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    eliminarTipoRoom(id) {
        let url = `room/type/delete/${id}`

        return new Promise((resolve, reject) => {
            LOCAL.api.delete(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Crea un nuevo estado de habitación mediante una solicitud POST a la API.
     * @function
     * @memberof RoomService
     * @param {Object} data - Datos del estado de habitación a crear.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    crearEstadoRoom(data) {
        let url = 'room/estado/create'

        return new Promise((resolve, reject) => {
            LOCAL.api.post(url, data)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Obtiene todos los estados de habitaciones mediante una solicitud GET a la API.
     * @function
     * @memberof RoomService
     * @returns {Promise} Promesa que se resuelve con la lista de estados de habitaciones o se rechaza con un error.
     */
    obtenerEstadosRoom() {
        let url = 'room/estado'

        return new Promise((resolve, reject) => {
            LOCAL.api.get(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Actualiza un estado de habitación existente mediante una solicitud PATCH a la API.
     * @function
     * @memberof RoomService
     * @param {Object} data - Datos actualizados del estado de habitación.
     * @param {number} id - Identificador único del estado de habitación a actualizar.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    actualizarEstadoRoom(data, id) {
        let url = `room/estado/update/${id}`

        return new Promise((resolve, reject) => {
            LOCAL.api.patch(url, data)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Elimina un estado de habitación existente mediante una solicitud DELETE a la API.
     * @function
     * @memberof RoomService
     * @param {number} id - Identificador único del estado de habitación a eliminar.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    eliminarEstadoRoom(id) {
        let url = `room/estado/delete/${id}`

        return new Promise((resolve, reject) => {
            LOCAL.api.delete(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Obtiene la bitácora de cambios para una habitación específica mediante una solicitud GET a la API.
     * @function
     * @memberof RoomService
     * @param {number} id - Identificador único de la habitación.
     * @returns {Promise} Promesa que se resuelve con la bitácora de cambios o se rechaza con un error.
     */
    bitacora(id) {
        let url = `room/bitacora/${id}`

        return new Promise((resolve, reject) => {
            LOCAL.api.get(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Guarda los precios para una habitación específica mediante una solicitud POST a la API.
     * @function
     * @memberof RoomService
     * @param {Object} data - Datos de precios a guardar.
     * @param {number} id - Identificador único de la habitación.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    guardarPrecios(data, id) {
        let url = `room/precios/${id}`

        return new Promise((resolve, reject) => {
            LOCAL.api.post(url, data)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Obtiene los precios asociados a una habitación específica mediante una solicitud GET a la API.
     * @function
     * @memberof RoomService
     * @param {number} id - Identificador único de la habitación.
     * @returns {Promise} Promesa que se resuelve con la lista de precios o se rechaza con un error.
     */
    obtenerPrecios(id) {
        let url = `room/precios/${id}`

        return new Promise((resolve, reject) => {
            LOCAL.api.get(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Crea un nuevo desayuno mediante una solicitud POST a la API.
     * @function
     * @memberof RoomService
     * @param {Object} data - Datos del desayuno a crear.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    crearDesayuno(data) {
        let url = 'desayunos/create'

        return new Promise((resolve, reject) => {
            LOCAL.api.post(url, data)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Obtiene la lista de desayunos disponibles mediante una solicitud GET a la API.
     * @function
     * @memberof RoomService
     * @returns {Promise} Promesa que se resuelve con la lista de desayunos o se rechaza con un error.
     */
    obtenerDesayunos() {
        let url = 'desayunos/read'

        return new Promise((resolve, reject) => {
            LOCAL.api.get(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Actualiza la información de un desayuno existente mediante una solicitud PATCH a la API.
     * @function
     * @memberof RoomService
     * @param {Object} data - Nuevos datos del desayuno a actualizar.
     * @param {number} id - Identificador único del desayuno.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    actualizarDesayuno(data, id) {
        let url = `desayunos/update/${id}`

        return new Promise((resolve, reject) => {
            LOCAL.api.patch(url, data)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Elimina un desayuno existente mediante una solicitud DELETE a la API.
     * @function
     * @memberof RoomService
     * @param {number} id - Identificador único del desayuno a eliminar.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    eliminarDesayuno(id) {
        let url = `desayunos/delete/${id}`

        return new Promise((resolve, reject) => {
            LOCAL.api.delete(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Crea una nueva decoración mediante una solicitud POST a la API.
     * @function
     * @memberof RoomService
     * @param {Object} data - Datos de la decoración a crear.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    crearDecoracion(data) {
        let url = 'decoraciones/create'

        return new Promise((resolve, reject) => {
            LOCAL.api.post(url, data)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Obtiene la lista de decoraciones disponibles mediante una solicitud GET a la API.
     * @function
     * @memberof RoomService
     * @returns {Promise} Promesa que se resuelve con la lista de decoraciones o se rechaza con un error.
     */
    obtenerDecoraciones() {
        let url = 'decoraciones/read'

        return new Promise((resolve, reject) => {
            LOCAL.api.get(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Actualiza la información de una decoración existente mediante una solicitud PATCH a la API.
     * @function
     * @memberof RoomService
     * @param {Object} data - Nuevos datos de la decoración a actualizar.
     * @param {number} id - Identificador único de la decoración.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    actualizarDecoracion(data, id) {
        let url = `decoraciones/update/${id}`

        return new Promise((resolve, reject) => {
            LOCAL.api.post(url, data)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Elimina una decoración existente mediante una solicitud DELETE a la API.
     * @function
     * @memberof RoomService
     * @param {number} id - Identificador único de la decoración a eliminar.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    eliminarDecoracion(id) {
        let url = `decoraciones/delete/${id}`

        return new Promise((resolve, reject) => {
            LOCAL.api.delete(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Obtiene la lista de jornadas disponibles mediante una solicitud GET a la API.
     * @function
     * @memberof RoomService
     * @returns {Promise} Promesa que se resuelve con la lista de jornadas o se rechaza con un error.
     */
    getJornadas() {
        let url = 'jornadas/read'

        return new Promise((resolve, reject) => {
            LOCAL.api.get(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Actualiza la imagen de una habitación existente mediante una solicitud POST a la API.
     * @function
     * @memberof RoomService
     * @param {Object} data - Datos de la imagen a actualizar.
     * @param {number} id - Identificador único de la habitación.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    actualizarRoomImg(data, id) {
        let url = `room/img/${id}`

        let config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }

        return new Promise((resolve, reject) => {
            LOCAL.api.post(url, data, config)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Crea una nueva característica de habitación mediante una solicitud POST a la API.
     * @function
     * @memberof RoomService
     * @param {Object} data - Datos de la característica a crear.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    crearCaracteristica(data) {
        let url = `room/caracteristicas/create`

        return new Promise((resolve, reject) => {
            LOCAL.api.post(url, data)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Obtiene la lista de características de habitación mediante una solicitud GET a la API.
     * @function
     * @memberof RoomService
     * @returns {Promise} Promesa que se resuelve con la lista de características o se rechaza con un error.
     */
    obtenerCaracteristicas() {
        let url = `room/caracteristicas/read`

        return new Promise((resolve, reject) => {
            LOCAL.api.get(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Actualiza una característica de habitación existente mediante una solicitud PATCH a la API.
     * @function
     * @memberof RoomService
     * @param {Object} data - Datos actualizados de la característica.
     * @param {number} id - Identificador único de la característica.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    actualizarCaracteristica(data, id) {
        let url = `room/caracteristicas/update/${id}`

        return new Promise((resolve, reject) => {
            LOCAL.api.patch(url, data)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Elimina una característica de habitación mediante una solicitud DELETE a la API.
     * @function
     * @memberof RoomService
     * @param {number} id - Identificador único de la característica.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    eliminarCaracteristica(id) {
        let url = `room/caracteristicas/delete/${id}`

        return new Promise((resolve, reject) => {
            LOCAL.api.delete(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Actualiza el estado de múltiples habitaciones mediante una solicitud PATCH a la API.
     * @function
     * @memberof RoomService
     * @param {Object} data - Datos de las habitaciones a actualizar.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    actualizarRooms(data) {
        let url = `room/estados`

        return new Promise((resolve, reject) => {
            LOCAL.api.patch(url, data)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },
}

LOCAL.Axios()

export default roomService