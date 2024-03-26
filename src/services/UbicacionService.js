import axios from "axios";
import vuex from "@/store";
import CacheManager from "./CacheManager/CacheManager";

const LOCAL = {
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

const UbicacionService = {

    obtenerPaises() {
        let url = `paises`

        return cacheManager.obtenerDatos('paises', url)
    },
    
    obtenerDepartamentos(id) {
        let url = `departamentos-${id}`

        return cacheManager.obtenerDatos(`departamentos-${id}`, url)
    },
    
    obtenerCiudades(id) {
        let url = `ciudades-${id}`

        return cacheManager.obtenerDatos(`ciudades-${id}`, url)
    },
}

export default UbicacionService
