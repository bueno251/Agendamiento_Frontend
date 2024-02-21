<template>
    <v-card width="90%" elevation="5">
        <v-card-title class="blue lighten-2">
            Reservas Confirmadas
        </v-card-title>
        <v-container fluid>
            <v-card-title>
                <v-row>

                    <v-col cols="12" md="2">
                        <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition"
                            offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="fechaLLegada" label="Fecha Llegada" prepend-inner-icon="mdi-calendar"
                                    v-bind="attrs" v-on="on" clearable readonly dense outlined>
                                </v-text-field>
                            </template>
                            <v-date-picker v-model="fechaLLegada" :active-picker.sync="datePicker1" min="1950-01-01"
                                :max="fechaSalida" @change="save('menu1', fechaLLegada)" locale="es">
                            </v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" md="2">
                        <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" transition="scale-transition"
                            offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="fechaSalida" label="Fecha Salida" prepend-inner-icon="mdi-calendar"
                                    v-bind="attrs" v-on="on" clearable readonly dense outlined>
                                </v-text-field>
                            </template>
                            <v-date-picker v-model="fechaSalida" :active-picker.sync="datePicker2" :min="fechaLLegada"
                                @change="save('menu2', fechaSalida)" locale="es">
                            </v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" md="2">
                        <v-text-field v-model="documento" label="Documento" dense outlined>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="2">
                        <v-text-field v-model="telefono" label="Telefono" dense outlined>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="2">
                        <v-btn @click="filtrar()">
                            buscar
                        </v-btn>
                    </v-col>

                    <v-col cols="12">
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details />
                    </v-col>
                </v-row>
            </v-card-title>
            <v-data-table :headers="headers" :items="reservasFilter" :search="search" :loading="loading"
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
                                    <v-list-item link @click="reserva = item">
                                        <v-list-item-title v-text="'Reagendar'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="reserva = item">
                                        <v-list-item-title v-text="'Cancelar'"></v-list-item-title>
                                    </v-list-item>
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
                        <td>{{ item.telefono }}</td>
                        <td>{{ item.fullname }}</td>
                        <td>$ {{ comaEnMiles(item.precio) }} COP</td>
                        <td>{{ item.estado }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-container>
    </v-card>
</template>

<script>
import reservaService from '../service/reservaService';

export default {
    name: 'ReservasAprobadas',
    data() {
        return {
            search: '',
            documento: '',
            telefono: '',
            estado: '',
            fechaLLegada: '',
            fechaSalida: '',
            loading: true,
            loadingbtn: false,
            menu1: false,
            menu2: false,
            dialogAprobar: false,
            dialogRechazar: false,
            dialogComprobante: false,
            datePicker1: null,
            datePicker2: null,
            reserva: {
                comprobante: '',
            },
            reservas: [],
            reservasFilter: [],
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Creada el', key: 'created_at', value: 'created_at' },
                { text: 'Fecha Llegada', key: 'datein', value: 'fechaEntrada' },
                { text: 'Fecha Salida', key: 'dateout', value: 'fechaSalida' },
                { text: 'Huespedes', key: 'huespedes', value: 'huespedes' },
                { text: 'Documento', key: 'cedula', value: 'cedula' },
                { text: 'Telefono', key: 'telefono', value: 'telefono' },
                { text: 'Huesped', key: 'huesped', value: 'huesped' },
                { text: 'Precio', key: 'precio', value: 'precio' },
                { text: 'Estado', key: 'estado', value: 'estado' },
            ],
            rootBackend: process.env.VUE_APP_URL_BASE.replace('/api', '/storage/'),
        }
    },
    watch: {
        menu1(val) {
            val && setTimeout(() => (this.datePicker1 = 'YEAR'))
        },
        menu2(val) {
            val && setTimeout(() => (this.datePicker2 = 'YEAR'))
        },
    },
    methods: {
        getReservas() {
            this.loading = true

            reservaService.obtenerReservas('Confirmada')
                .then(res => {
                    this.reservas = res
                    this.reservasFilter = res
                    this.loading = false
                })
                .catch(err => {
                    this.loading = false
                    console.log(err)
                })
        },
        save(menu, date) {
            this.$refs[menu].save(date)
        },
        filtrar() {

            if (
                !this.documento &&
                !this.telefono &&
                !this.fechaLLegada &&
                !this.fechaSalida
            ) {
                this.reservasFilter = this.reservas
                return
            }

            this.reservasFilter = this.reservas.filter(reserva => {
                // Verificar si ambas fechas están presentes
                if (this.fechaLLegada && this.fechaSalida) {
                    return reserva.cedula == this.documento ||
                        reserva.telefono == this.telefono ||
                        (reserva.fechaEntrada >= this.fechaLLegada && reserva.fechaSalida <= this.fechaSalida);
                } else {
                    // Solo hay una fecha, realizar la comprobación correspondiente
                    return reserva.cedula == this.documento ||
                        reserva.telefono == this.telefono ||
                        (this.fechaLLegada && reserva.fechaEntrada >= this.fechaLLegada) ||
                        (this.fechaSalida && reserva.fechaSalida <= this.fechaSalida);
                }
            });
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
    },
    mounted() {
        this.getReservas()
    },
}
</script>

<style scoped></style>