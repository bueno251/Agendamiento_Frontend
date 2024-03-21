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

const CuponesService = {

    crearCupon(data) {
        let url = `cupon`

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

    obtenerCupones(id = '') {

        let url = `cupones`

        if (id) {
            url += `/${id}`
        }

        return cacheManager.obtenerDatos('cupones', url)
    },

    obtenerCupon(codigo, id) {
        let url = `cupones-${codigo}-${id}`

        return cacheManager.obtenerDatos(url, url)
    },

    obtenerPrecios() {
        let url = `precios`

        return cacheManager.obtenerDatos(`precios`, url)
    },

    actualizarCupon(data, id) {
        let url = `cupon/${id}`

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

    actualizarCodigosCupon(data) {
        let url = `cupones`

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

    eliminarCupon(id) {
        let url = `cupon/${id}`

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

export default CuponesService