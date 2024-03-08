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
 * Servicio para realizar operaciones relacionadas con las reservas utilizando la API externa.
 * @namespace TipoCancelacionService
 * @type {Object}
 */
const TipoCancelacionService = {

    crearTipoCancelacion(data) {
        let url = `cancelar/tipo`

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

    obtenerTiposCancelacion() {
        let url = `cancelar/tipos`

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

    actualizarTipoCancelacion(data, id) {
        let url = `cancelar/tipo${id}`

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

    eliminarTipoCancelacion(id) {
        let url = `cancelar/tipo${id}`

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

export default TipoCancelacionService