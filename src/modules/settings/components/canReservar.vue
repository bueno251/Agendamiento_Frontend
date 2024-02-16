<template>
    <v-card width="90%">
        <v-card-title class="blue lighten-2">
            Reservas
        </v-card-title>
        <v-container fluid>
            <v-row>
                <v-col cols="auto">
                    <div class="flex">
                        Usuario puede reservar?
                        <v-switch v-model="canReservar" :label="canReservar ? 'Si' : 'No'" inset></v-switch>
                    </div>
                </v-col>
            </v-row>
            <div class="buttons">
                <v-btn @click="save" :loading="loading" color="primary">
                    guardar
                </v-btn>
            </div>
        </v-container>
    </v-card>
</template>

<script>

import Swal from 'sweetalert2'
import configService from '../services/configService'

export default {
    name: 'canReservar',
    props: {
        bolean: Boolean,
        id: Number,
    },
    watch: {
        bolean: {
            handler(newbolean) {
                this.canReservar = newbolean
            },
            immediate: true,
        }
    },
    data() {
        return {
            canReservar: true,
            loading: false,
        }
    },
    methods: {
        /**
         * Guarda la configuración de reserva, indicando si los usuarios pueden o no realizar reservas.
         */
        save() {
            this.loading = true

            // Objeto de datos que se enviará al servicio para actualizar la configuración de reserva
            let data = {
                configuracionId: this.id,
                reservar: this.canReservar
            }

            // Llama al servicio para actualizar la configuración de reserva
            configService.reservar(data)
                .then(res => {
                    this.loading = false
                    this.$emit('update') // Emite un evento para informar a componentes padre sobre la actualización
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    this.loading = false
                    Swal.fire({
                        icon: 'error',
                        text: err.response.data.message,
                    })
                    console.log(err)
                })
        }
    },
}
</script>

<style scoped>
.flex {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
</style>