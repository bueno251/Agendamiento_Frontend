import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
const ls = new SecureLS({ isCompression: false });

Vue.use(Vuex);

const store = new Vuex.Store({
    plugins: [
        createPersistedState({
            storage: {
                getItem: (key) => ls.get(key),
                setItem: (key, value) => ls.set(key, value),
                removeItem: (key) => ls.remove(key),
            },
        }),
    ],

    state: {
        token: null,
        tokenUbicacion: {},
        user: {},
        reserva: {},
    },

    mutations: {
        SET_TOKEN(state, value) {
            state.token = value;
        },
        SET_TOKEN_UBICACION(state, value) {
            state.tokenUbicacion = value;
        },
        SET_USER(state, value) {
            state.user = value;
        },
        SET_RESERVA(state, value){
            state.reserva = value;
        },
        LOGOUT(state) {
            state.token = null;
            state.tokenUbicacion = {};
            state.user = {};
        },
    },

    actions: {
        setToken({ commit }, newToken) {
            commit('SET_TOKEN', newToken);
        },
        setTokenUbicacion({ commit }, newToken) {
            commit('SET_TOKEN_UBICACION', newToken);
        },
        setUser({ commit }, newUser) {
            commit('SET_USER', newUser);
        },
        setReserva({ commit }, newReserva) {
            commit('SET_RESERVA', newReserva);
        },
        logout({ commit }) {
            commit('LOGOUT');
        },
    },

    modules: {},
});

export default store