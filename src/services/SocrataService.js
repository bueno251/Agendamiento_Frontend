import axios from "axios"
import CacheManager from "./CacheManager/CacheManager"

const LOCAL = {
    Axios() {
        LOCAL.api = axios.create({
            headers: {
                'X-App-Token': process.env.VUE_APP_API_TRM
            },
        })
    }
}

LOCAL.Axios()
const cacheManager = new CacheManager(LOCAL.api)

const SocrataService = {

    valorDolar() {

        let hoy = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)

        let url = `https://www.datos.gov.co/resource/32sa-8pi3.json?vigenciahasta=${hoy}`

        return cacheManager.obtenerDatos('valorDolar', url)
    },

}

export default SocrataService
