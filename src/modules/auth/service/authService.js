import axios from "axios"

/**
 * Módulo para manejar las solicitudes de autenticación.
 * @module AuthService
 */
const LOCAL = {
    /**
     * Configura Axios con la URL base de la API.
     */
    Axios() {
        LOCAL.api = axios.create({
            baseURL: process.env.VUE_APP_URL_BASE + "/api",
        })
    }
}

/**
 * Servicio de autenticación que utiliza Axios para las solicitudes HTTP.
 * @namespace AuthService
 * @type {Object}
 */
const AuthService = {
    /**
     * Realiza una solicitud de inicio de sesión.
     * 
     * @memberof AuthService
     * @param {Object} data - Datos de inicio de sesión.
     * @returns {Promise<Object>} - Promesa que se resuelve con los datos de la respuesta.
     */
    login(data) {
        let url = 'login'

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
}

LOCAL.Axios()

export default AuthService