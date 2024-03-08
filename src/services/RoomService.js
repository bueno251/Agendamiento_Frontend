import axios from "axios"
import vuex from "@/store"

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

const roomService = {

    /**
     * Crea una nueva habitación mediante una solicitud POST a la API.
     * @function
     * @memberof RoomService
     * @param {FormData} data - Datos de la habitación a crear, incluyendo archivos si es necesario.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    crearRoom(data) {
        let url = 'room'

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
    obtenerAllRooms() {
        let url = 'rooms/read'

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
     * Obtiene la lista de habitaciones disponibles para el cliente.
     * 
     * @memberof reservaService
     * @function obtenerRooms
     * @returns {Promise<Object>} - Promesa que se resuelve con los datos de la respuesta.
     * @throws {Error} - Error si la obtención de habitaciones falla.
     */
    obtenerRooms() {
        let url = 'rooms'

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
     * Obtiene información detallada de una habitación por su ID.
     * 
     * @function obtenerRoom
     * @param {string} id - Identificador único de la habitación.
     * @returns {Promise<Object>} - Promesa que se resuelve con los datos de la habitación.
     * @throws {Error} - Error si la obtención de la habitación falla.
     */
    obtenerRoom(id) {
        let url = `room/${id}`

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
        let url = `room/${id}`

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
        let url = `room/${id}`

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
     * Actualiza el estado de múltiples habitaciones mediante una solicitud PATCH a la API.
     * @function
     * @memberof RoomService
     * @param {Object} data - Datos de las habitaciones a actualizar.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    actualizarRooms(data) {
        let url = `rooms`

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

    eliminarRoomHija(id) {
        let url = `room-hija/${id}`

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
}

LOCAL.Axios()

export default roomService