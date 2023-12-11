import axios from "axios";
import vuex from "@/store";

const local = {
    Axios() {
        local.api = axios.create({
            baseURL: process.env.VUE_APP_URL_BASE,
            headers: {
                Authorization: `Bearer ${vuex.state.token}`
            },
        })
    }
}

const calendarService = {
    obtenerRooms() {
        let url = 'room/read'

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
}

local.Axios()

export default calendarService