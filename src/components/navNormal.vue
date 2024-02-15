<template>
    <nav class="nav blue text--accent-4 mb-5">

        <div>
            Logo
        </div>

        <div>
            <v-menu :offset-y="true" transition="scale-transition">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-avatar size="50px">
                            <v-icon>
                                mdi-account-circle
                            </v-icon>
                        </v-avatar>
                    </v-btn>
                </template>
                <v-list v-if="!vuex.state.token">
                    <v-list-item link :to="{ name: 'login' }">
                        <v-list-item-title v-text="'Iniciar Sesión'"></v-list-item-title>
                    </v-list-item>
                </v-list>
                <v-list v-else>
                    <v-list-item link :to="{ name: 'reservasApp' }">
                        <v-list-item-title v-text="'Ver Reservas'"></v-list-item-title>
                    </v-list-item>
                    <v-list-item link @click="logout">
                        <v-list-item-title v-text="'Cerrar Sesión'"></v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </nav>
</template>

<script>

import vuex from "@/store";

export default {
    name: 'navNormal',
    data() {
        return {
            show: false,
            vuex: vuex,
        }
    },
    methods: {
        /**
        * Cierra la sesión actual del usuario y redirige a la página de visualización de habitaciones.
        * Utiliza Vuex para despachar la acción de cierre de sesión.
        */
        logout() {
            // Despacha la acción de cierre de sesión a través de Vuex
            this.$store.dispatch('logout')

            // Redirige a la página de visualización de habitaciones
            this.$router.push({ name: 'viewRooms' }).catch(() => { })
        }
    },
}
</script>

<style scoped>
.nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 50px;
}
</style>