import axios from "axios"
import vuex from "@/store"

/**
 * Módulo para manejar las solicitudes relacionadas con clientes.
 * @module clienteService
 */
const LOCAL = {
    /**
     * Configura Axios con la URL base de la API y el token de autorización.
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

/**
 * Servicio para realizar operaciones relacionadas con clientes utilizando Axios para las solicitudes HTTP.
 * @namespace clienteService
 * @type {Object}
 */
const clienteService = {

    /**
     * Crea un nuevo cliente.
     * @memberof clienteService
     * @param {Object} data - Datos del cliente a crear.
     * @returns {Promise<Object>} - Promesa que se resuelve con los datos de la respuesta.
     * @throws {Error} - Error si la creación del cliente falla.
     */
    crear(data) {
        let url = 'client/create'

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
     * Obtiene la lista de clientes.
     * @memberof clienteService
     * @returns {Promise<Object>} - Promesa que se resuelve con los datos de la respuesta.
     * @throws {Error} - Error si la obtención de clientes falla.
     */
    obtener() {
        let url = 'client/read'

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
     * Obtiene los tipos de clientes.
     * @memberof clienteService
     * @returns {Promise<Object>} - Promesa que se resuelve con los datos de la respuesta.
     * @throws {Error} - Error si la obtención de tipos de clientes falla.
     */
    obtenerTipos() {
        let url = 'client/type/all'

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
     * Encuentra un cliente por su número de documento.
     * @memberof clienteService
     * @param {string} documento - Número de documento del cliente a buscar.
     * @returns {Promise<Object>} - Promesa que se resuelve con los datos de la respuesta.
     * @throws {Error} - Error si la búsqueda del cliente falla.
     */
    encontrarDocumento(documento) {
        let url = `client/find/document/${documento}`

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
     * Actualiza un cliente existente.
     * @memberof clienteService
     * @param {Object} data - Datos del cliente a actualizar.
     * @param {string} id - ID del cliente a actualizar.
     * @returns {Promise<Object>} - Promesa que se resuelve con los datos de la respuesta.
     * @throws {Error} - Error si la actualización del cliente falla.
     */
    actualizar(data, id) {
        let url = `client/update/${id}`

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

    /**
     * Elimina un cliente existente.
     * @memberof clienteService
     * @param {string} id - ID del cliente a eliminar.
     * @returns {Promise<Object>} - Promesa que se resuelve con los datos de la respuesta.
     * @throws {Error} - Error si la eliminación del cliente falla.
     */
    eliminar(id) {
        let url = `client/delete/${id}`

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
     * Obtiene los valores predeterminados para los clientes.
     * @memberof clienteService
     * @returns {Promise<Object>} - Promesa que se resuelve con los datos de la respuesta.
     * @throws {Error} - Error si la obtención de valores predeterminados falla.
     */
    obtenerValoresDefault() {
        let url = `default`

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

export default clienteService