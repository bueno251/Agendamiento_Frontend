<template>
    <div class="nav mb-5">
        <v-app-bar color="blue" dark>
            <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" absolute temporary>
            <v-list nav dense>
                <v-list-item-group v-model="group" active-class="blue--text text--accent-4"  mandatory>
                    <v-list-item to="calendario">
                        <v-list-item-icon>
                            <v-icon>mdi-calendar-month</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Calendario</v-list-item-title>
                    </v-list-item>

                    <v-list-item to="clientes">
                        <v-list-item-icon>
                            <v-icon>mdi-account-group</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Clientes</v-list-item-title>
                    </v-list-item>
                    
                    <v-list-item to="habitaciones">
                        <v-list-item-icon>
                            <v-icon>mdi-bed</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Habitaciones</v-list-item-title>
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
}
</script>

<style scoped>
.nav{
    width: 100%;
}
</style>