<template>
    <div>
        <v-timeline align-top dense>
            <v-timeline-item v-for="reserva in reservas" :key="reserva.id" :color="colores[reserva.estado]" small>
                <v-card class="pa-5">
                    <h3 class="font-weight-normal">
                        <strong>{{ reserva.fechaEntrada }} - {{ reserva.fechaSalida }}</strong>
                        <v-menu :offset-x="true" transition="scale-transition">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on">
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item link>
                                    <v-list-item-title v-text="'Registrar llegada'"></v-list-item-title>
                                </v-list-item>
                                <v-list-item link>
                                    <v-list-item-title v-text="'Ver Comprobante'"></v-list-item-title>
                                </v-list-item>
                                <v-list-item link>
                                    <v-list-item-title v-text="'Aprobar'"></v-list-item-title>
                                </v-list-item>
                                <v-list-item link>
                                    <v-list-item-title v-text="'Rechazar'"></v-list-item-title>
                                </v-list-item>
                                <v-list-item link>
                                    <v-list-item-title v-text="'Reagendar'"></v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </h3>
                    <v-divider class="my-5"></v-divider>
                    <h4>
                        $ {{ comaEnMiles(reserva.precio) }} COP
                    </h4>
                    <span class="mr-5">
                        Huespedes: {{ reserva.huespedes }}
                    </span>
                    <v-tooltip right v-if="reserva.huespedes > 1">
                        <template v-slot:activator="{ on, attrs }">
                            <span v-bind="attrs" v-on="on">
                                <v-icon size="20px">mdi-help-circle</v-icon>
                            </span>
                        </template>
                        <v-row>
                            <v-col cols="12">
                                Adultos: {{ reserva.adultos }}
                            </v-col>
                            <v-col cols="12">
                                Niños: {{ reserva.niños }}
                            </v-col>
                        </v-row>
                    </v-tooltip>
                    <div>
                        Desayuno: {{ reserva.desayuno }}
                    </div>
                    <div>
                        Decoración: {{ reserva.decoracion }}
                    </div>
                </v-card>
            </v-timeline-item>
        </v-timeline>
    </div>
</template>

<script>

import vuex from "@/store";
import UserService from './service/UserService.js'

export default {
    name: 'myReservasApp',
    data() {
        return {
            temporales: [],
            reservas: [],
            colores: {
                Pendiente: 'blue',
                Confirmada: 'green',
                Cancelada: 'red',
            },
        }
    },
    methods: {
        getReservas() {
            let userId = vuex.state.user.id

            UserService.getReservas(userId)
                .then(res => {
                    this.reservas = res.reservas
                    this.temporales = res.temporales
                })
                .catch(err => {
                    console.log(err)
                })
        },
        /**
         * Formatea un número agregando comas para separar miles.
         * @param {number} numero - Número que se formateará.
         * @returns {string} Número formateado con comas.
         */
        comaEnMiles(numero) {
            let exp = /(\d)(?=(\d{3})+(?!\d))/g // expresión regular que busca tres dígitos
            let rep = '$1.' //parámetro especial para splice porque los números no son menores a 100
            return numero.toString().replace(exp, rep)
        },
    },
    mounted() {
        this.getReservas()
    },
}
</script>

<style scoped></style>