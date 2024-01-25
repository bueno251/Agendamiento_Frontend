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

const roomService = {

    crearRoom(data) {
        let url = 'room/create'

        let config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }

        return new Promise((resolve, reject) => {
            local.api.post(url, data, config)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    obtenerRooms() {
        let url = 'room/read'

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

    actualizarRoom(data, id) {
        let url = `room/update/${id}`

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

    eliminarRoom(id) {
        let url = `room/delete/${id}`

        return new Promise((resolve, reject) => {
            local.api.delete(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    crearRoomTipo(data) {
        let url = 'room/type/create'

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

    obtenerRoomTipos() {
        let url = 'room/type'

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

    actualizarRoomTipo(data, id) {
        let url = `room/type/update/${id}`

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

    eliminarRoomTipo(id) {
        let url = `room/type/delete/${id}`

        return new Promise((resolve, reject) => {
            local.api.delete(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },
    crearRoomEstado(data) {
        let url = 'room/estado/create'

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

    obtenerRoomEstados() {
        let url = 'room/estado'

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

    actualizarRoomEstado(data, id) {
        let url = `room/estado/update/${id}`

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

    eliminarRoomEstado(id) {
        let url = `room/estado/delete/${id}`

        return new Promise((resolve, reject) => {
            local.api.delete(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    bitacora(id) {
        let url = `room/bitacora/${id}`

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

    savePrecios(data, id) {
        let url = `room/precios/${id}`

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

    getPrecios(id) {
        let url = `room/precios/${id}`

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

    crearDesayuno(data) {
        let url = 'desayunos/create'

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

    obtenerDesayunos() {
        let url = 'desayunos/read'

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

    actualizarDesayuno(data, id) {
        let url = `desayunos/update/${id}`

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

    eliminarDesayuno(id) {
        let url = `desayunos/delete/${id}`

        return new Promise((resolve, reject) => {
            local.api.delete(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    crearDecoracion(data) {
        let url = 'decoraciones/create'

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

    obtenerDecoraciones() {
        let url = 'decoraciones/read'

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

    actualizarDecoracion(data, id) {
        let url = `decoraciones/update/${id}`

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

    eliminarDecoracion(id) {
        let url = `decoraciones/delete/${id}`

        return new Promise((resolve, reject) => {
            local.api.delete(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    getJornadas() {
        let url = 'jornadas/read'

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

    actualizarRoomImg(data, id) {
        let url = `room/img/${id}`

        let config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }

        return new Promise((resolve, reject) => {
            local.api.post(url, data, config)
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

export default roomService