import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'

Vue.prototype.$axios = axios
Vue.prototype.$token = localStorage.token || ''

axios.defaults.baseURL = 'http://127.0.0.1:8000/api'

Vue.config.productionTip = false

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')
