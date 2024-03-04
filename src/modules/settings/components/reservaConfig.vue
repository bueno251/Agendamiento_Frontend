<template>
    <v-card width="90%">
        <v-card-title class="blue lighten-2 white--text">
            Reservas
        </v-card-title>
        <v-container fluid>
            <v-row class="ma-0">
                <v-col cols="12" md="3" sm="6">
                    <div class="flex">
                        <p>
                            Usuario puede reservar?
                        </p>
                        <v-switch v-model="canReservar" :label="canReservar ? 'Si' : 'No'" inset></v-switch>
                    </div>
                </v-col>

                <v-col cols="12" md="3" sm="6">
                    <div class="flex">
                        <p>
                            Correo obligatorio para el pago?
                        </p>
                        <v-switch v-model="correoRequired" :label="correoRequired ? 'Si' : 'No'" inset></v-switch>
                    </div>
                </v-col>

                <v-col cols="12" md="3" sm="6">
                    <div class="flex">
                        <p class="px-2">
                            Porcentaje de separación de la reserva: {{ porcentSeparacion }} %
                        </p>
                        <v-text-field v-model="porcentSeparacion" type="number" min="0" max="100" hide-spin-buttons
                            outlined hide-details dense required>
                        </v-text-field>
                    </div>
                    <v-slider v-model="porcentSeparacion" max="100" min="0" thumb-label dense hide-details></v-slider>
                </v-col>
            </v-row>

            <div class="buttons mt-5">
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
                    this.porcentSeparacion = newItem.porcentajeSeparacion
                }
            },
            immediate: true,
        }
    },
    data() {
        return {
            porcentSeparacion: 0,
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
                porcentaje: this.porcentSeparacion,
            }

            // Llama al servicio para actualizar la configuración de reserva
            configService.guardarConfigReserva(data)
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
                    console.error(err)
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

p {
    padding: 0;
    margin: 0;
    text-wrap: balance;
}
</style>