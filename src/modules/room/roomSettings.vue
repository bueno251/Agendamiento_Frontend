<template>
    <div class="content">
        <v-card width="90%" flat tile>
            <v-card-actions class="justify-space-between">
                <v-btn-toggle v-model="onboarding" mandatory>
                    <v-btn>
                        <v-icon>mdi-format-align-left</v-icon> Estados
                    </v-btn>
                    <v-btn>
                        <v-icon>mdi-format-align-center</v-icon> Tipos
                    </v-btn>
                </v-btn-toggle>
            </v-card-actions>
            <v-window v-model="onboarding" reverse>
                <v-window-item v-for="n in length" :key="`card-${n}`">
                    <estadoSettings></estadoSettings>
                </v-window-item>
            </v-window>

        </v-card>
    </div>
</template>

<script>

import estadoSettings from "./components/estadoSettings";

export default {
    components: {
        estadoSettings
    },
    data() {
        return {
            length: 2,
            onboarding: 0,
        }
    },
    methods: {
        next() {
            this.onboarding = this.onboarding + 1 === this.length
                ? 0
                : this.onboarding + 1
        },
        prev() {
            this.onboarding = this.onboarding - 1 < 0
                ? this.length - 1
                : this.onboarding - 1
        },
    },
}
</script>

<style scoped></style>