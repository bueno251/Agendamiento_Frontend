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

        return cacheManager.obtenerDatos('tarifas-generales', url)
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

}

export default TarifaGeneralService