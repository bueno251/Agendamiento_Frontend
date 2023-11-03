<template>
    <div class="nav mb-5">
        <v-app-bar color="blue" dark>
            <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" absolute temporary>
            <v-list nav dense>
                <v-list-item-group v-model="group" active-class="blue--text text--accent-4" mandatory>
                    <v-list-item router :to="{ name: 'reservas' }">
                        <v-list-item-icon>
                            <v-icon>mdi-calendar-month</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Reservas</v-list-item-title>
                    </v-list-item>

                    <v-list-item router :to="{ name: 'clientes' }">
                        <v-list-item-icon>
                            <v-icon>mdi-account-group</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Clientes</v-list-item-title>
                    </v-list-item>

                    <v-list-group no-action prepend-icon="mdi-bed" :value="false">
                        <template v-slot:activator>
                            <v-list-item-content>
                                <v-list-item-title>Habitaciones</v-list-item-title>
                            </v-list-item-content>
                        </template>

                        <v-list-item router :to="{ name: 'habitaciones' }">
                            <v-list-item-title>Consultar</v-list-item-title>
                        </v-list-item>
                        
                        <v-list-item router :to="{ name: 'habitacionesConfig' }">
                            <v-list-item-title>Ajustes</v-list-item-title>
                        </v-list-item>
                    </v-list-group>

                    <v-list-item router :to="{ name: 'configuracion' }">
                        <v-list-item-icon>
                            <v-icon>mdi-cog</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>configuración</v-list-item-title>
                    </v-list-item>

                    <v-list-item link @click="closeSession">
                        <v-list-item-icon>
                            <v-icon>mdi-logout-variant</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>cerrar sesión</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            drawer: false,
            group: null,
        }
    },
    methods: {
        closeSession() {
            this.$token = ''
            localStorage.clear()
            this.$router.push({ name: 'login' })
        }
    },
}
</script>

<style scoped>
.nav {
    width: 100%;
}
</style>