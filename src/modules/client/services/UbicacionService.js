import axios from "axios"
import store from "@/store"

/**
 * Objeto LOCAL para gestionar las solicitudes y el token de la API de ubicación.
 * @namespace LOCAL
 * @type {Object}
 */
const LOCAL = {
    /**
     * Configura Axios con la URL base de la API de ubicación.
     * @memberof LOCAL
     * @function Axios
     */
    Axios() {
        LOCAL.api = axios.create({
            baseURL: 'https://www.universal-tutorial.com/api',
        })
    },

    /**
     * Obtiene el token de acceso y configura Axios con el token para las solicitudes.
     * @async
     * @memberof LOCAL
     * @function getToken
     */
    async getToken() {
        let hoy = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)

        // Verifica si ya existe un token de ubicación en el estado de Vuex
        if (store.state.tokenUbicacion && hoy == store.state.tokenUbicacion.date) {
            // Si ya existe un token en Vuex, lo configura en Axios
            LOCAL.api.defaults.headers.common['Authorization'] = `Bearer ${store.state.tokenUbicacion.token}`

        } else {
            let url = 'https://www.universal-tutorial.com/api/getaccesstoken'

            let config = {
                headers: {
                    'api-token': process.env.VUE_APP_API_TOKEN_UBICACION,
                    'user-email': process.env.VUE_APP_EMAIL_UBICACION,
                }
            }

            // Obtiene el token de acceso y lo configura en Axios y Vuex
            await axios.get(url, config)
                .then(res => {
                    LOCAL.api.defaults.headers.common['Authorization'] = `Bearer ${res.data.auth_token}`

                    let tokenUbicacion = {
                        token: res.data.auth_token,
                        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
                    }

                    store.commit('SET_TOKEN_UBICACION', tokenUbicacion)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
}

/**
 * Servicio para realizar operaciones relacionadas con la ubicación utilizando la API externa.
 * @namespace UbicacionService
 * @type {Object}
 */
const UbicacionService = {

    /**
     * Obtiene la lista de países desde la API de ubicación.
     * @async
     * @memberof UbicacionService
     * @function paises
     * @returns {Promise<Object>} - Promesa que se resuelve con los datos de la respuesta.
     * @throws {Error} - Error si la obtención de países falla.
     */
    paises() {
        let url = `countries`

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
     * Obtiene la lista de departamentos para un país específico desde la API de ubicación.
     * @async
     * @memberof UbicacionService
     * @function departamentos
     * @param {string} pais - Código del país.
     * @returns {Promise<Object>} - Promesa que se resuelve con los datos de la respuesta.
     * @throws {Error} - Error si la obtención de departamentos falla.
     */
    departamentos(pais) {
        let url = `states/${pais}`

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
     * Obtiene la lista de ciudades para un departamento específico desde la API de ubicación.
     * @async
     * @memberof UbicacionService
     * @function ciudades
     * @param {string} departamento - Código del departamento.
     * @returns {Promise<Object>} - Promesa que se resuelve con los datos de la respuesta.
     * @throws {Error} - Error si la obtención de ciudades falla.
     */
    ciudades(departamento) {
        let url = `cities/${departamento}`

        return new Promise((resolve, reject) => {
            LOCAL.api.get(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
}

LOCAL.Axios()
await LOCAL.getToken()

export default UbicacionService