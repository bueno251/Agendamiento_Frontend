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

const TarifaGeneralService = {

    guardarTarifasGenerales(data) {
        let url = 'tarifas-generales'

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

    obtenerTarifasGenerales() {
        let url = `tarifas-generales`

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

    eliminarTarifaGeneral(id) {
        let url = `tarifa-general/${id}`

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

export default TarifaGeneralService