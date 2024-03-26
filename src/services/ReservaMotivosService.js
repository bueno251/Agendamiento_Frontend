import axios from "axios"
import vuex from "@/store"
import CacheManager from "./CacheManager/CacheManager"

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

LOCAL.Axios()
const cacheManager = new CacheManager(LOCAL.api)

const ReservaMotivosService = {

    obtenerMotivosReserva() {
        let url = 'reserva-motivos'

        return cacheManager.obtenerDatos('reserva-motivos', url)
    },

}

export default ReservaMotivosService