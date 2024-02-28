<template>
    <v-card width="90%">
        <v-card-title class="blue lighten-2 white--text">
            Reservas
        </v-card-title>
        <v-container fluid>
            <v-row class="ma-0">
                <v-col cols="12" md="3">
                    <div class="flex">
                        <p>
                            Usuario puede reservar?
                        </p>
                        <v-switch v-model="canReservar" :label="canReservar ? 'Si' : 'No'" inset></v-switch>
                    </div>
                </v-col>

                <v-col cols="12" md="3">
                    <div class="flex">
                        <p>
                            Correo obligatorio para el pago?
                        </p>
                        <v-switch v-model="correoRequired" :label="correoRequired ? 'Si' : 'No'" inset></v-switch>
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
import configService from '@/services/ConfigService'

export default {
    name: 'reservaConfig',
    props: {
        config: Object,
    },
    watch: {
        config: {
            handler(newItem) {
                if ('id' in newItem) {
                    this.canReservar = newItem.usuarioReserva
                    this.correoRequired = newItem.correoObligatorio
                }
            },
            immediate: true,
        }
    },
    data() {
        return {
            canReservar: true,
            correoRequired: true,
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
                configuracionId: this.config.id,
                reservar: this.canReservar,
                correo: this.correoRequired,
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
    gap: 10px;
}

p{
    padding: 0;
    margin: 0;
    text-wrap: balance;
}
</style>