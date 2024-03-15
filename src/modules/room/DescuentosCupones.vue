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
                        <DescuentosApp />
                    </div>
                </v-window-item>
                <v-window-item>
                    <div class="d-flex justify-center">
                        <CuponesApp />
                    </div>
                </v-window-item>
            </v-window>
        </v-card>
    </div>
</template>

<script>

import DescuentosApp from './DescuentosApp'
import CuponesApp from './CuponesApp.vue';

export default {
    components: {
        DescuentosApp,
        CuponesApp
    },
    data() {
        return {
            onboarding: 0,
            items: [
                'Descuentos',
                'Cupones',
            ],
        }
    },
}
</script>

<style scoped></style>