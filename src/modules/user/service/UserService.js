import axios from "axios"
import vuex from "@/store"

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

const UserService = {
    getReservas(user) {
        let url = `reserva/${user}`

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

    getClienteInfo(id) {
        let url = `client/find/${id}`

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
    
    obtenerTipos() {
        let url = 'client/type/all'

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
    
    savePersonal(data, cliente){
        let url = `client/personal/${cliente}`
    
        return new Promise((resolve, reject) => {
            local.api.patch(url, data)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    saveContacto(data, cliente){
        let url = `client/contacto/${cliente}`
    
        return new Promise((resolve, reject) => {
            local.api.patch(url, data)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    saveLegal(data, cliente){
        let url = `client/legal/${cliente}`
    
        return new Promise((resolve, reject) => {
            local.api.patch(url, data)
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

export default UserService