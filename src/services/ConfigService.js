import axios from "axios"
import vuex from "@/store"
import CacheManager from "./CacheManager/CacheManager"

const LOCAL = {
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

const ConfigService = {

    guardarMetodosPago(data) {
        let url = 'settings/pagos'

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

    obtenerConfig() {
        let url = 'settings'

        return cacheManager.obtenerDatos('settings', url)
    },

    guardarConfigReserva(data) {
        let url = 'settings/reservar'

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

    guardarEmpresa(data) {
        let url = 'settings/empresa'

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

    obtenerTiposEmpresa() {
        let url = 'settings/empresa/tipos'

        return cacheManager.obtenerDatos('settings/empresa/tipos', url)
    },

    guardarValoresDefault(data) {
        let url = `default`

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

    obtenerValoresDefault() {
        let url = `default`

        return cacheManager.obtenerDatos('default', url)
    },

    crearMetodoPago(data) {
        let url = `metodoPago`

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
     * Obtiene la lista de métodos de pago disponibles.
     * 
     * @function obtenerMetodosPago
     * @returns {Promise<Object>} - Promesa que se resuelve con los datos de los métodos de pago disponibles.
     * @throws {Error} - Error si la obtención de métodos de pago falla.
     */
    obtenerMetodosPago() {
        let url = 'pagos'

        return cacheManager.obtenerDatos('pagos', url)
    },

    obtenerConfigReserva() {
        let url = `reservar`

        return cacheManager.obtenerDatos('reservar', url)
    },
}

export default ConfigService