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

const DescuentosService = {

    crearDescuento(data) {
        let url = `descuento`

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

    obtenerTiposDescuento() {
        let url = `descuento-tipos`

        return cacheManager.obtenerDatos('descuento-tipos', url)
    },

    obtenerRoomsDescuento() {
        let url = `descuento-rooms`

        return cacheManager.obtenerDatos('descuento-rooms', url)
    },

    obtenerDescuentos(id = '') {

        let url = `descuentos`

        if (id) {
            url += `/${id}`
        }

        return cacheManager.obtenerDatos(url, url)
    },

    actualizarDescuento(data, id) {
        let url = `descuento/${id}`

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

    eliminarDescuento(id) {
        let url = `descuento/${id}`

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

export default DescuentosService