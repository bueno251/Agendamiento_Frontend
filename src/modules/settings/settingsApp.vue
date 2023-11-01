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
                <div class="buttons">
                    <v-btn color="primary">
                        guardar
                    </v-btn>
                </div>
            </v-container>
        </v-card>

        <v-card width="90%">
            <v-card-title class="blue lighten-2">
                Reservas
            </v-card-title>
            <v-container fluid>
                <v-row>
                    <v-col cols="auto">
                        <div class="flex">
                            Usuario puede reservar?
                            <v-switch v-model="canReservar" :label="canReservar? 'Si': 'No'" inset></v-switch>
                        </div>
                    </v-col>
                </v-row>
                <div class="buttons">
                    <v-btn color="primary">
                        guardar
                    </v-btn>
                </div>
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
    methods: {
        getSettings(){
            
        }
    },
}
</script>

<style scoped>
.content {
    gap: 10px;
}

.flex{
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
</style>