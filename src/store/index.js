import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
const ls = new SecureLS({ isCompression: false });

Vue.use(Vuex);

export default new Vuex.Store({
    plugins: [
        // Configuración del plugin de persistencia
        createPersistedState({
            storage: {
                getItem: (key) => ls.get(key), // Obtener datos del almacenamiento local
                setItem: (key, value) => ls.set(key, value), // Establecer datos del almacenamiento local
                removeItem: (key) => ls.remove(key), // Eliminar datos del almacenamiento local
            },
        }),
    ],

    state: {
        // Estado inicial de la aplicación
        token: null, // Token de autenticación
        user: {}, // Información del user
    },

    mutations: {
        // Mutaciones para actualizar el estado
        token(state, value) {
            state.token = value;
        },
        user(state, value) {
            state.user = value;
        },
        cerrarSesion(state) {
            state.token = null;
            state.user = {};
        },
    },

    modules: {},
});