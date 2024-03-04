import axios from "axios"
import vuex from "@/store"

const LOCAL = {
    /**
     * Configura Axios con la URL base de la API de reservas y el token de autorización.
     * @memberof LOCAL
     * @function Axios
     */
    Axios() {
        LOCAL.api = axios.create({
            baseURL: process.env.VUE_APP_URL_BASE + "/api",
            headers: {
                Authorization: `Bearer ${vuex.state.token}`
            },
        })
    }
}

const DesayunoService = {

    /**
     * Crea un nuevo desayuno mediante una solicitud POST a la API.
     * @function
     * @memberof DesayunoService
     * @param {Object} data - Datos del desayuno a crear.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    crearDesayuno(data) {
        let url = 'desayunos/create'

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
     * Obtiene la lista de desayunos disponibles mediante una solicitud GET a la API.
     * @function
     * @memberof DesayunoService
     * @returns {Promise} Promesa que se resuelve con la lista de desayunos o se rechaza con un error.
     */
    obtenerDesayunos() {
        let url = 'desayunos/read'

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

    /**
     * Actualiza la información de un desayuno existente mediante una solicitud PATCH a la API.
     * @function
     * @memberof DesayunoService
     * @param {Object} data - Nuevos datos del desayuno a actualizar.
     * @param {number} id - Identificador único del desayuno.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    actualizarDesayuno(data, id) {
        let url = `desayunos/update/${id}`

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
     * Elimina un desayuno existente mediante una solicitud DELETE a la API.
     * @function
     * @memberof DesayunoService
     * @param {number} id - Identificador único del desayuno a eliminar.
     * @returns {Promise} Promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    eliminarDesayuno(id) {
        let url = `desayunos/delete/${id}`

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

LOCAL.Axios()

export default DesayunoService