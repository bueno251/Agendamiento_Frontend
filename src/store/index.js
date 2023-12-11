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
        user: {},
    },

    mutations: {
        SET_TOKEN(state, value) {
            state.token = value;
        },
        SET_USER(state, value) {
            state.user = value;
        },
        LOGOUT(state) {
            state.token = null;
            state.user = {};
        },
    },

    actions: {
        setToken({ commit }, newToken) {
            commit('SET_TOKEN', newToken);
        },
        setUser({ commit }, newUser) {
            commit('SET_USER', newUser);
        },
        logout({ commit }) {
            commit('LOGOUT');
        },
    },

    modules: {},
});

export default store