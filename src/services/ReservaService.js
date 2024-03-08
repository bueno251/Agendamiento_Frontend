import axios from "axios"
import vuex from "@/store"

/**
 * Objeto LOCAL para gestionar las solicitudes y configuración de la API de reservas.
 * @namespace LOCAL
 * @type {Object}
 */
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

/**
 * Servicio para realizar operaciones relacionadas con las reservas utilizando la API externa.
 * @namespace ReservaService
 * @type {Object}
 */
const ReservaService = {

    /**
     * Realiza una nueva reserva.
     * 
     * @function reservar
     * @param {Object} data - Datos de la reserva a realizar.
     * @returns {Promise<Object>} - Promesa que se resuelve con los datos de la nueva reserva.
     * @throws {Error} - Error si la reserva falla.
     */
    reservar(data) {
        let url = 'reserva'

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
     * Realiza el pago de una reserva.
     * 
     * @function pagar
     * @param {Object} data - Datos del pago de la reserva.
     * @returns {Promise<Object>} - Promesa que se resuelve con los datos del pago realizado.
     * @throws {Error} - Error si el pago de la reserva falla.
     */
    pagar(data) {
        let url = 'reserva/pagar'

        let config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }

        return new Promise((resolve, reject) => {
            LOCAL.api.post(url, data, config)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Obtiene la lista de reservas con un estado opcional.
     * 
     * @memberof ReservaService
     * @function obtenerReservas
     * @param {string} [estado=''] - Estado opcional de la reserva.
     * @returns {Promise<Object>} - Promesa que se resuelve con los datos de la respuesta.
     * @throws {Error} - Error si la obtención de reservas falla.
     */
    obtenerReservas(estado = '') {
        let url = `reservas`

        if (estado) {
            url += `/${estado}`
        }

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
     * Aprueba una reserva especificada por su ID.
     * 
     * @function aprobarReserva
     * @param {string} id - Identificador único de la reserva.
     * @returns {Promise<Object>} - Promesa que se resuelve con los datos de la reserva aprobada.
     * @throws {Error} - Error si la aprobación de la reserva falla.
     */
    aprobarReserva(id) {
        let url = `reserva/approve/${id}`

        return new Promise((resolve, reject) => {
            LOCAL.api.patch(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Rechaza una reserva especificada por su ID.
     * 
     * @function rechazarReserva
     * @param {string} id - Identificador único de la reserva.
     * @returns {Promise<Object>} - Promesa que se resuelve con los datos de la reserva rechazada.
     * @throws {Error} - Error si el rechazo de la reserva falla.
     */
    rechazarReserva(id) {
        let url = `reserva/reject/${id}`

        return new Promise((resolve, reject) => {
            LOCAL.api.patch(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    /**
     * Obtiene las fechas disponibles de una habitación por su ID.
     * 
     * @function getFechasRoom
     * @param {string} id - Identificador único de la habitación.
     * @returns {Promise<Object>} - Promesa que se resuelve con las fechas disponibles de la habitación.
     * @throws {Error} - Error si la obtención de fechas de la habitación falla.
     */
    getFechasRoom(id) {
        let url = `reserva/room/${id}`

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

    cancelarReserva(data, id) {
        let url = `reserva/cancelar/${id}`

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

export default ReservaService