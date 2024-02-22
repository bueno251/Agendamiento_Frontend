<template>
    <div class="content">
        <v-card width="90%" flat tile>
            <v-card-actions class="justify-space-between">
                <v-btn-toggle v-model="onboarding" mandatory>
                    <v-btn>
                        Estados
                    </v-btn>
                    <v-btn>
                        Tipos
                    </v-btn>
                </v-btn-toggle>
            </v-card-actions>
            <v-window v-model="onboarding" reverse>
                <v-window-item>
                    <estadoSettings></estadoSettings>
                </v-window-item>
                <v-window-item>
                    <tipoSettings></tipoSettings>
                </v-window-item>
            </v-window>

        </v-card>
    </div>
</template>

<script>

import estadoSettings from "./components/estadoSettings";
import tipoSettings from "./components/tipoSettings";

export default {
    components: {
        estadoSettings,
        tipoSettings,
    },
    data() {
        return {
            length: 2,
            onboarding: 0,
        }
    },
}
</script>

<style scoped></style>