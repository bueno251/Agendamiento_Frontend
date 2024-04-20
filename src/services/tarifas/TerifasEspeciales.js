import axios from "axios"
import vuex from "@/store"
import CacheManager from "../CacheManager/CacheManager"

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

const TarifaEspecialesService = {

    crearTarifaEspecial(data) {
        let url = 'tarifa-especial'

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

    obtenerTarifasEspeciales(id) {
        let url = `tarifas-especiales/${id}`

        return cacheManager.obtenerDatos(`tarifas-especiales/${id}`, url)
    },

    actualizarTarifaEspecial(data, id) {
        let url = `tarifa-especial/${id}`

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

    eliminarTarifaEspecial(id) {
        let url = `tarifa-especial/${id}`

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

export default TarifaEspecialesService