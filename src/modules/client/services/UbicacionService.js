import axios from "axios";
import vuex from "@/store";

const local = {
    Axios() {
        local.api = axios.create({
            baseURL: 'https://www.universal-tutorial.com/api',
        })
    },

    async getToken() {
        if (!vuex.state.tokenUbicacion) {
            let url = 'https://www.universal-tutorial.com/api/getaccesstoken'

            let config = {
                headers: {
                    'api-token': process.env.VUE_APP_API_TOKEN_UBICACION,
                    'user-email': process.env.VUE_APP_EMAIL_UBICACION,
                }
            }

            await axios.get(url, config)
                .then(res => {
                    local.api.defaults.headers.common['Authorization'] = `Bearer ${res.data.auth_token}`
                    vuex.dispatch('setToken', res.data.auth_token)
                })
                .catch(err => {
                    console.log(err);
                })
                
        } else {
            local.api.defaults.headers.common['Authorization'] = `Bearer ${vuex.state.tokenUbicacion}`
        }
    }
}

const UbicacionService = {

    paises() {
        let url = `countries`

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

    departamentos(pais) {
        let url = `states/${pais}`

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

    ciudades(departamento) {
        let url = `cities/${departamento}`

        return new Promise((resolve, reject) => {
            local.api.get(url)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
}

local.Axios()
await local.getToken()

export default UbicacionService