import axios from "axios"
import vuex from "@/store"
import CacheManager from "../CacheManager/CacheManager"

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

const TipoRoomService = {

    /**
     * Crea un nuevo tipo de habitación mediante una solicitud POST a la API.
     * @function
     * @memberof TipoRoomService
     * @param {Object} data - Datos del tipo de habitación a crear.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    crearTipoRoom(data) {
        let url = 'tipo-room'

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
     * @memberof TipoRoomService
     * @returns {Promise} Promesa que se resuelve con la lista de tipos de habitaciones o se rechaza con un error.
     */
    obtenerTiposRoom() {
        let url = 'tipos-room'

        return cacheManager.obtenerDatos('tipos-room', url)
    },

    /**
     * Actualiza un tipo de habitación existente mediante una solicitud PATCH a la API.
     * @function
     * @memberof TipoRoomService
     * @param {Object} data - Datos actualizados del tipo de habitación.
     * @param {number} id - Identificador único del tipo de habitación a actualizar.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    actualizarTipoRoom(data, id) {
        let url = `tipo-room/${id}`

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
     * @memberof TipoRoomService
     * @param {number} id - Identificador único del tipo de habitación a eliminar.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    eliminarTipoRoom(id) {
        let url = `tipo-room/${id}`

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

export default TipoRoomService