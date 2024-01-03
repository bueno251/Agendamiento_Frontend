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
                                    <v-list-item link @click="reserva = item">
                                        <v-list-item-title v-text="'Registrar llegada'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item v-if="item.comprobante" link
                                        @click="reserva = item, dialogComprobante = true">
                                        <v-list-item-title v-text="'Ver Comprobante'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="reserva = item, dialogAprobar = true">
                                        <v-list-item-title v-text="'Aprobar'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="reserva = item, dialogRechazar = true">
                                        <v-list-item-title v-text="'Rechazar'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="reserva = item">
                                        <v-list-item-title v-text="'Reagendar'"></v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                        <td>{{ item.fechaEntrada }}</td>
                        <td>{{ item.fechaSalida }}</td>
                        <td>{{ item.huespedes }}</td>
                        <td>{{ item.adultos }}</td>
                        <td>{{ item.niños }}</td>
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

import reservaService from './service/reservaService';

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
                { text: 'Fecha Llegada', key: 'datein', value: 'fechaEntrada' },
                { text: 'Fecha Salida', key: 'dateout', value: 'fechaSalida' },
                { text: 'Huespedes', key: 'huespedes', value: 'huespedes' },
                { text: 'Adultos', key: 'adultos', value: 'adultos' },
                { text: 'Niños', key: 'niños', value: 'niños' },
                { text: 'Precio', key: 'precio', value: 'precio' },
                { text: 'Estado', key: 'estado', value: 'estado' },
            ],
            rootBackend: process.env.VUE_APP_URL_BASE.replace('/api', '/storage/'),
        }
    },
    methods: {
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
        comaEnMiles(numero) {
            let exp = /(\d)(?=(\d{3})+(?!\d))/g //* expresion regular que busca tres digitos
            let rep = '$1.' //parametro especial para splice porque los numeros no son menores a 100
            return numero.toString().replace(exp, rep)
        },
        aprobar() {
            this.loadingbtn = true

            reservaService.aprobarReserva(this.reserva.id)
                .then(res => {
                    this.loadingbtn = false
                    this.getReservas()
                    console.log(res)
                })
                .catch(err => {
                    this.loadingbtn = false
                    console.log(err)
                })
        },
        rechazar() {
            this.loadingbtn = true

            reservaService.rechazarReserva(this.reserva.id)
                .then(res => {
                    this.loadingbtn = false
                    this.getReservas()
                    console.log(res)
                })
                .catch(err => {
                    this.loadingbtn = false
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