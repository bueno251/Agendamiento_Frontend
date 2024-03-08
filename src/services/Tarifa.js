import axios from "axios"
import vuex from "@/store"

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

const TarifaService = {

    guardarTarifa(data) {
        let url = 'tarifa'

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

    guardarTarifas(data, id) {
        let url = `tarifas/${id}`

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
    obtenerTarifas(id) {
        let url = `tarifas/${id}`

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

    eliminarTarifa(id) {
        let url = `tarifa/${id}`

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
    obtenerJornadas() {
        let url = 'jornadas'

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

}

LOCAL.Axios()

export default TarifaService