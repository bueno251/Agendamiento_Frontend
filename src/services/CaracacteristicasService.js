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

const CaracteristicasService = {

    /**
     * Crea una nueva característica de habitación mediante una solicitud POST a la API.
     * @function
     * @memberof CaracteristicasService
     * @param {Object} data - Datos de la característica a crear.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    crearCaracteristica(data) {
        let url = `caracteristica`

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
     * @memberof CaracteristicasService
     * @returns {Promise} Promesa que se resuelve con la lista de características o se rechaza con un error.
     */
    obtenerCaracteristicas() {
        let url = `caracteristicas`

        return cacheManager.obtenerDatos('caracteristicas', url)
    },

    /**
     * Actualiza una característica de habitación existente mediante una solicitud PATCH a la API.
     * @function
     * @memberof CaracteristicasService
     * @param {Object} data - Datos actualizados de la característica.
     * @param {number} id - Identificador único de la característica.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    actualizarCaracteristica(data, id) {
        let url = `caracteristica/${id}`

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
     * @memberof CaracteristicasService
     * @param {number} id - Identificador único de la característica.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    eliminarCaracteristica(id) {
        let url = `caracteristica/${id}`

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

export default CaracteristicasService