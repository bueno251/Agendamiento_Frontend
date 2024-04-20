import axios from "axios"
import vuex from "@/store"
import CacheManager from "../CacheManager/CacheManager"

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

LOCAL.Axios()
const cacheManager = new CacheManager(LOCAL.api)

const ReprogramarMotivosService = {

    obtenerMotivosReprogramar() {
        let url = 'motivos-reprogramacion'

        return cacheManager.obtenerDatos('motivos-reprogramacion', url)
    },

}

export default ReprogramarMotivosService