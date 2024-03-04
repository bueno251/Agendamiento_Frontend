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

const DecoracionService = {

    /**
     * Crea una nueva decoración mediante una solicitud POST a la API.
     * @function
     * @memberof DecoracionService
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
     * @memberof DecoracionService
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
     * @memberof DecoracionService
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
     * @memberof DecoracionService
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
}

LOCAL.Axios()

export default DecoracionService