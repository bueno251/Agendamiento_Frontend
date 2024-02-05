<template>
    <nav class="nav blue text--accent-4">

        <div>
            Logo
        </div>

        <!-- <div class="search-field">
            <v-text-field class="rounded-pill" prepend-inner-icon="mdi-magnify" type="text" width="500px" clearable dense
                outlined></v-text-field>
        </div> -->

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
        logout() {
            this.$store.dispatch('logout')
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