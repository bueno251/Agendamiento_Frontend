<template>
    <div class="content">
        <v-card width="100%" flat>
            <template>
                <v-spacer />
                <v-tabs v-model="onboarding" fixed-tabs show-arrows>
                    <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
                </v-tabs>
                <v-spacer />
            </template>

            <v-window v-model="onboarding" reverse>
                <v-window-item>
                    <div class="d-flex justify-center">
                        <estadoSettings />
                    </div>
                </v-window-item>
                <v-window-item>
                    <div class="d-flex justify-center">
                        <tipoSettings />
                    </div>
                </v-window-item>
                <v-window-item>
                    <div class="d-flex justify-center">
                        <desayunosApp />
                    </div>
                </v-window-item>
                <v-window-item>
                    <div class="d-flex justify-center">
                        <decoracionesApp />
                    </div>
                </v-window-item>
                <v-window-item>
                    <div class="d-flex justify-center">
                        <caracteristicasApp />
                    </div>
                </v-window-item>
            </v-window>
        </v-card>
    </div>
</template>

<script>

import desayunosApp from "./desayunosApp"
import decoracionesApp from "./decoracionesApp"
import tipoSettings from "./components/tipoSettings"
import caracteristicasApp from "./caracteristicasApp"
import estadoSettings from "./components/estadoSettings"

export default {
    components: {
        desayunosApp,
        decoracionesApp,
        caracteristicasApp,
        tipoSettings,
        estadoSettings,
    },
    data() {
        return {
            onboarding: 0,
            items: [
                'Estados De Habitación',
                'Tipos De Habitación',
                'Desayunos',
                'Decoraciones',
                'Caracteristicas',
            ],
        }
    },
}
</script>

<style scoped></style>