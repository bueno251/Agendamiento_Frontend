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

const DescuentoEstadiaService = {

    crearDescuentoEstadia(data) {
        let url = `descuento-estadia`

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

    obtenerDescuentosEstadia(id = '') {

        let url = `descuentos-estadia`

        if (id) {
            url += `/${id}`
        }

        return cacheManager.obtenerDatos(url, url)
    },

    actualizarDescuentoEstadia(data, id) {
        let url = `descuento-estadia/${id}`

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

    eliminarDescuentoEstadia(id) {
        let url = `descuento-estadia/${id}`

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

export default DescuentoEstadiaService