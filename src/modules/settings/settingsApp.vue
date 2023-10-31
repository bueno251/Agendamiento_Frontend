<template>
    <div class="content">
        <v-card width="90%">
            <v-card-title class="blue lighten-2">
                Tipo De Pagos Que Recibe La Empresa
            </v-card-title>
            <v-container fluid>
                <v-row>
                    <v-col cols="auto" v-for="tipo in tipos" :key="tipo">
                        <v-checkbox v-model="tipoPago" :label="tipo" :value="tipo"></v-checkbox>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>

        <v-card width="90%">
            <v-card-title class="blue lighten-2">
                Reservas
            </v-card-title>
            <v-container fluid>
                <v-row>
                    <v-col cols="auto">
                        <p>Usuario puede reservar?</p>
                        <v-switch v-model="canReservar" :label="canReservar? 'Si': 'No'" inset></v-switch>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </div>
</template>

<script>
export default {
    name: 'settingsApp',
    data() {
        return {
            canReservar: true,
            tipoPago: [],
            tipos: [
                'Transferencias',
                'Pasarela de pago',
            ]
        }
    },
}
</script>

<style scoped>
.content {
    gap: 10px;
}
</style>