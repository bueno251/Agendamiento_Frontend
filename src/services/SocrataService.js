import axios from "axios";

const LOCAL = {
    Axios() {
        LOCAL.api = axios.create({
            headers: {
                'X-App-Token': process.env.VUE_APP_API_TRM
            },
        })
    }
}

const SocrataService = {

    valorDolar() {

        let hoy = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)

        let url = `https://www.datos.gov.co/resource/32sa-8pi3.json?vigenciahasta=${hoy}`

        return new Promise((resolve, reject) => {
            LOCAL.api.get(url)
                .then((res) => {
                    resolve(res.data[0])
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

}

LOCAL.Axios()

export default SocrataService