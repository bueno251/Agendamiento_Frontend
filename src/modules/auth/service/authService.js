import axios from "axios";

const local = {
    Axios() {
        local.api = axios.create({
            baseURL: process.env.VUE_APP_URL_BASE,
        })
    }
}

const authService = {

    login(data) {
        let url = 'login'

        return new Promise((resolve, reject) => {
            local.api.post(url, data)
                .then((res) => {
                    this.$store.commit("token", res.data.token);
                    this.$store.commit("user", res.data.user);
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

}

local.Axios()

export default authService