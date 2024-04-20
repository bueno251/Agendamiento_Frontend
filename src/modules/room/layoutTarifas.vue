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
                        <roomTarifas />
                    </div>
                </v-window-item>

                <v-window-item>
                    <div class="d-flex justify-center">
                        <tarifasOtas />
                    </div>
                </v-window-item>

            </v-window>
        </v-card>
    </div>
</template>

<script>

import roomTarifas from './roomTarifas.vue'
import tarifasOtas from './tarifaOtas.vue'

export default {
    components: {
        roomTarifas,
        tarifasOtas,
    },
    data() {
        return {
            onboarding: 0,
            items: [
                'Normales',
                'OTAS',
            ],
        }
    },
}
</script>

<style scoped></style>