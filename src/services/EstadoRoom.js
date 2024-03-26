import axios from "axios"
import vuex from "@/store"
import CacheManager from "./CacheManager/CacheManager"

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

LOCAL.Axios()
const cacheManager = new CacheManager(LOCAL.api)

const roomService = {

    /**
     * Crea un nuevo estado de habitación mediante una solicitud POST a la API.
     * @function
     * @memberof RoomService
     * @param {Object} data - Datos del estado de habitación a crear.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    crearEstadoRoom(data) {
        let url = 'estado-room'

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
        let url = 'estados-room'

        return cacheManager.obtenerDatos('estados-room', url)
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
        let url = `estado-room/${id}`

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
        let url = `estado-room/${id}`

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

export default roomService