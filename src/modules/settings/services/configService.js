import axios from "axios";
import vuex from "@/store";

const local = {
    Axios() {
        local.api = axios.create({
            baseURL: process.env.VUE_APP_URL_BASE,
            headers: {
                Authorization: `Bearer ${vuex.state.token}`
            },
        })
    }
}

const configService = {

    pagos(data) {
        let url = 'settings/pagos'

        return new Promise((resolve, reject) => {
            local.api.post(url, data)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    obtener() {
        let url = 'settings/read'

        return new Promise((resolve, reject) => {
            local.api.get(url)
                .then((res) => {
                    resolve(res.data[0])
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    reservar(data) {
        let url = 'settings/reservar'

        return new Promise((resolve, reject) => {
            local.api.post(url, data)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    empresa(data) {
        let url = 'settings/empresa'

        return new Promise((resolve, reject) => {
            local.api.post(url, data)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    obtenerEmpresaTipos() {
        let url = 'settings/empresa/types'

        return new Promise((resolve, reject) => {
            local.api.get(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    valoresDefault(data) {
        let url = `default`

        return new Promise((resolve, reject) => {
            local.api.post(url, data)
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

        return new Promise((resolve, reject) => {
            local.api.get(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },
}

local.Axios()

export default configService