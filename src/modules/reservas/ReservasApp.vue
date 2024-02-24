<template>
    <div class="content">
        <h1>
            Consultar Reservas
        </h1>
        <v-card width="90%" class="my-5">
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                    hide-details></v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="reservas" :search="search" :loading="loading"
                :footer-props="{ itemsPerPageText: 'Número de filas', pageText: '{0}-{1} de {2}' }"
                no-results-text="No hay ninguna reserva que coincida" no-data-text="No hay reservas"
                loading-text="Cargando... Por favor espera">
                <template v-slot:item="{ item }">
                    <tr>
                        <td>
                            <v-menu :offset-x="true" transition="scale-transition">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon v-bind="attrs" v-on="on">
                                        <v-icon>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item v-if="item.comprobante" link
                                        @click="reserva = item, dialogComprobante = true">
                                        <v-list-item-title v-text="'Ver Comprobante'"></v-list-item-title>
                                    </v-list-item>

                                    <template v-if="item.estado == 'Confirmada'">
                                        <v-list-item link @click="reserva = item">
                                            <v-list-item-title v-text="'Registrar llegada'"></v-list-item-title>
                                        </v-list-item>

                                        <v-list-item link @click="reserva = item">
                                            <v-list-item-title v-text="'Reagendar'"></v-list-item-title>
                                        </v-list-item>
                                        
                                        <v-list-item link @click="reserva = item">
                                            <v-list-item-title v-text="'Cancelar'"></v-list-item-title>
                                        </v-list-item>
                                    </template>

                                    <template v-if="item.estado == 'Pendiente'">
                                        <v-list-item link @click="reserva = item, dialogAprobar = true">
                                            <v-list-item-title v-text="'Aprobar'"></v-list-item-title>
                                        </v-list-item>

                                        <v-list-item link @click="reserva = item, dialogRechazar = true">
                                            <v-list-item-title v-text="'Rechazar'"></v-list-item-title>
                                        </v-list-item>
                                    </template>
                                </v-list>
                            </v-menu>
                        </td>
                        <td>{{ item.created_at }}</td>
                        <td>{{ item.fechaEntrada }}</td>
                        <td>{{ item.fechaSalida }}</td>
                        <td>
                            <v-row class="ma-0">
                                <span class="mr-5">
                                    {{ item.huespedes }}
                                </span>
                                <v-tooltip right v-if="item.huespedes > 1">
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on">
                                            <v-icon size="20px">mdi-help-circle</v-icon>
                                        </span>
                                    </template>
                                    <v-row>
                                        <v-col cols="12">
                                            Adultos: {{ item.adultos }}
                                        </v-col>
                                        <v-col cols="12">
                                            Niños: {{ item.niños }}
                                        </v-col>
                                    </v-row>
                                </v-tooltip>
                            </v-row>
                        </td>
                        <td>{{ item.cedula }}</td>
                        <td>{{ item.fullname }}</td>
                        <td>$ {{ comaEnMiles(item.precio) }} COP</td>
                        <td>{{ item.estado }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog :value="dialogAprobar" width="90%" max-width="500px" persistent>
            <v-card>
                <v-sheet class="d-flex justify-center align-center flex-column pa-5">
                    <h3>Aprobar la Reserva?</h3>
                    <div class="buttons">
                        <v-btn @click="dialogAprobar = false" color="error"
                            class="white--text text--accent-4">cancelar</v-btn>
                        <v-btn @click="aprobar" :loading="loadingbtn" color="primary">confirmar</v-btn>
                    </div>
                </v-sheet>
            </v-card>
        </v-dialog>
        <v-dialog :value="dialogRechazar" width="90%" max-width="500px" persistent>
            <v-card>
                <v-sheet class="d-flex justify-center align-center flex-column pa-5">
                    <h3>Rechazar la Reserva?</h3>
                    <div class="buttons">
                        <v-btn @click="dialogRechazar = false" color="error"
                            class="white--text text--accent-4">cancelar</v-btn>
                        <v-btn @click="rechazar" :loading="loadingbtn" color="primary">confirmar</v-btn>
                    </div>
                </v-sheet>
            </v-card>
        </v-dialog>
        <v-dialog v-if="!reserva.comprobante || reserva.comprobante.endsWith('.pdf')" :value="dialogComprobante" width="90%"
            max-width="300px" persistent>
            <v-card class="pa-5">
                <div class="buttons">
                    <v-btn @click="dialogComprobante = false" icon><v-icon>mdi-close-box</v-icon></v-btn>
                </div>
                <v-sheet class="d-flex justify-center align-center flex-column  ma-0">
                    <v-btn :href="rootBackend + reserva.comprobante" target="_blank" color="primary">
                        Descargar
                    </v-btn>
                </v-sheet>
            </v-card>
        </v-dialog>
        <v-dialog v-else :value="dialogComprobante" width="90%" persistent>
            <v-card class="pa-5">
                <div class="buttons">
                    <v-btn @click="dialogComprobante = false" icon><v-icon>mdi-close-box</v-icon></v-btn>
                </div>
                <v-sheet class="d-flex justify-center align-center flex-column  ma-0">
                    <v-img :src="rootBackend + reserva.comprobante" max-width="90%" alt="comprobante de pago"
                        title="Comprobante de pago"></v-img>
                </v-sheet>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import Swal from 'sweetalert2'
import reservaService from './service/reservaService'

export default {
    name: 'roomApp',
    data() {
        return {
            search: '',
            loading: false,
            loadingbtn: false,
            dialogAprobar: false,
            dialogRechazar: false,
            dialogComprobante: false,
            reserva: {
                comprobante: '',
            },
            reservas: [],
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Creada el', key: 'created_at', value: 'created_at' },
                { text: 'Fecha Llegada', key: 'datein', value: 'fechaEntrada' },
                { text: 'Fecha Salida', key: 'dateout', value: 'fechaSalida' },
                { text: 'Huespedes', key: 'huespedes', value: 'huespedes' },
                { text: 'Cedula', key: 'cedula', value: 'cedula' },
                { text: 'Huesped', key: 'huesped', value: 'huesped' },
                { text: 'Precio', key: 'precio', value: 'precio' },
                { text: 'Estado', key: 'estado', value: 'estado' },
            ],
            rootBackend: process.env.VUE_APP_URL_BASE.replace('/api', '/storage/'),
        }
    },
    methods: {
        /**
         * Obtiene la lista de reservas.
         * Realiza una llamada al servicio para obtener la información de las reservas y asigna los resultados a la variable reservas.
         */
        getReservas() {
            this.loading = true
            reservaService.obtenerReservas()
                .then(res => {
                    this.loading = false
                    this.reservas = res
                })
                .catch(err => {
                    this.loading = false
                    console.log(err)
                })
        },
        /**
         * Formatea un número agregando comas para separar miles.
         * @param {number} numero - Número que se formateará.
         * @returns {string} Número formateado con comas.
         */
        comaEnMiles(numero) {
            let exp = /(\d)(?=(\d{3})+(?!\d))/g //* expresión regular que busca tres dígitos
            let rep = '$1.' //parámetro especial para splice porque los números no son menores a 100
            return numero.toString().replace(exp, rep)
        },
        /**
         * Aprueba una reserva.
         * Realiza una llamada al servicio para aprobar una reserva por su ID y actualiza la lista de reservas.
         */
        aprobar() {
            this.loadingbtn = true
            reservaService.aprobarReserva(this.reserva.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogAprobar = false
                    this.getReservas() // Actualiza la lista de reservas
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    this.loadingbtn = false
                    Swal.fire({
                        icon: 'success',
                        text: err.response.data.message,
                    })
                    console.log(err)
                })
        },
        /**
         * Rechaza una reserva.
         * Realiza una llamada al servicio para rechazar una reserva por su ID y actualiza la lista de reservas.
         */
        rechazar() {
            this.loadingbtn = true
            reservaService.rechazarReserva(this.reserva.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogRechazar = false
                    this.getReservas() // Actualiza la lista de reservas
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    this.loadingbtn = false
                    Swal.fire({
                        icon: 'success',
                        text: err.response.data.message,
                    })
                    console.log(err)
                })
        },
    },
    mounted() {
        this.getReservas()
    },
}
</script>

<style scoped></style>