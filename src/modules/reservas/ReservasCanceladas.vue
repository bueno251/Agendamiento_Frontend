<template>
    <v-card width="90%" elevation="5">
        <v-card-title class="blue lighten-2 white--text">
            Reservas Canceladas
        </v-card-title>
        <v-container fluid>
            <v-card-title>
                <v-row>

                    <v-col cols="12" md="2" sm="4">
                        <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition"
                            offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="fechaLLegada" label="Fecha Llegada" prepend-inner-icon="mdi-calendar"
                                    v-bind="attrs" v-on="on" clearable readonly dense outlined>
                                </v-text-field>
                            </template>
                            <v-date-picker v-model="fechaLLegada" min="1950-01-01"
                                :max="fechaSalida" @change="save('menu1', fechaLLegada)" locale="es">
                            </v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" md="2" sm="4">
                        <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" transition="scale-transition"
                            offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="fechaSalida" label="Fecha Salida" prepend-inner-icon="mdi-calendar"
                                    v-bind="attrs" v-on="on" clearable readonly dense outlined>
                                </v-text-field>
                            </template>
                            <v-date-picker v-model="fechaSalida" :min="fechaLLegada"
                                @change="save('menu2', fechaSalida)" locale="es">
                            </v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" md="2" sm="4">
                        <v-text-field v-model="documento" label="Documento" dense outlined>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="2" sm="4">
                        <v-text-field v-model="telefono" label="Telefono" dense outlined>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="2" sm="4">
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
                no-results-text="No hay ningúna reserva que coincida" no-data-text="No hay reservas"
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

                                    <v-list-item link @click="reserva = [item], dialogMotivos = true">
                                        <v-list-item-title v-text="'Motivos'"></v-list-item-title>
                                    </v-list-item>

                                </v-list>
                            </v-menu>
                        </td>
                        <td>{{ item.bitacora.created_at.replace('.000000', '') }}</td>
                        <td>{{ item.bitacora.user }}</td>
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
                        <td>$ {{ comaEnMiles(item.precio) }} COP</td>
                        <td>{{ item.bitacora.tipo }}</td>
                        <td></td>
                        <td></td>
                    </tr>
                </template>
            </v-data-table>
        </v-container>

        <v-dialog :value="dialogMotivos" width="90%" max-width="1000px" persistent>
            <v-card class="pa-5">
                <v-toolbar elevation="0">
                    <v-toolbar-title>Motivos</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon class="ml-3" @click="dialogMotivos = false"><v-icon>mdi-close-box</v-icon></v-btn>
                </v-toolbar>
                <v-data-table :headers="headersMotivos" :items="reserva" :loading="loading"
                    no-data-text="No hay ningún cambio registrado" loading-text="Cargando... Por favor espera"
                    :footer-props="{ itemsPerPageText: 'Número de filas', pageText: '{0}-{1} de {2}' }">
                    <template v-slot:item="{ item }">
                        <tr>
                            <td>{{ item.cedula }}</td>
                            <td>{{ item.telefono }}</td>
                            <td>{{ item.fullname }}</td>
                            <td>{{ item.bitacora.motivo }}</td>
                        </tr>
                    </template>
                </v-data-table>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>

import reservaService from './service/reservaService'

export default {
    name: 'ReservasAprobadas',
    data() {
        return {
            search: '',
            documento: '',
            telefono: '',
            estado: '',
            fechaLLegada: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            fechaSalida: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            loading: true,
            loadingbtn: false,
            menu1: false,
            menu2: false,
            dialogComprobante: false,
            dialogMotivos: false,
            reserva: {
                comprobante: '',
            },
            reservas: [],
            reservasFilter: [],
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Cancelada el', key: 'bitacora.created_at', value: 'bitacora.created_at' },
                { text: 'Cancelada por', key: 'bitacora.user', value: 'bitacora.user' },
                { text: 'Fecha Llegada', key: 'datein', value: 'fechaEntrada' },
                { text: 'Fecha Salida', key: 'dateout', value: 'fechaSalida' },
                { text: 'Huespedes', key: 'huespedes', value: 'huespedes' },
                { text: 'Precio', key: 'precio', value: 'precio' },
                { text: 'Tipo', key: 'bitacora.tipo', value: 'bitacora.tipo' },
                { text: '', key: 'cedula', sortable: false },
                { text: '', key: 'telefono', sortable: false },
            ],
            headersMotivos: [
                { text: 'Documento', key: 'cedula', value: 'cedula' },
                { text: 'Telefono', key: 'telefono', value: 'telefono' },
                { text: 'Huesped', key: 'fullname', value: 'fullname' },
                { text: 'Motivo', key: 'bitacora.motivo', value: 'bitacora.motivo' },

            ],
            rootBackend: process.env.VUE_APP_URL_BASE + '/storage/',
        }
    },
    methods: {
        /**
         * Obtiene las reservas desde el servicio y actualiza las propiedades 'reservas' y 'reservasFilter'.
         */
        getReservas() {
            this.loading = true

            reservaService.obtenerReservas('Cancelada')
                .then(res => {
                    this.reservas = res
                    this.reservasFilter = res
                    this.loading = false
                })
                .catch(err => {
                    this.loading = false
                    console.error(err)
                })
        },
        /**
         * Invoca el método 'save' del componente referenciado por 'menu'.
         * @param {string} menu - Nombre del menú referenciado.
         * @param {Date} date - Fecha que se pasa al método 'save'.
         */
        save(menu, date) {
            this.$refs[menu].save(date)
        },
        /**
         * Filtra las reservas según los criterios proporcionados.
         */
        filtrar() {
            // Verifica si no se han proporcionado criterios de filtrado.
            if (!this.documento && !this.telefono && !this.fechaLLegada && !this.fechaSalida) {
                this.reservasFilter = this.reservas
                return
            }

            // Filtra las reservas según los criterios proporcionados.
            this.reservasFilter = this.reservas.filter(reserva => {
                // Verificar si ambas fechas están presentes.
                if (this.fechaLLegada && this.fechaSalida) {
                    return (
                        reserva.cedula == this.documento ||
                        reserva.telefono == this.telefono ||
                        (reserva.fechaEntrada >= this.fechaLLegada && reserva.fechaSalida <= this.fechaSalida)
                    )
                } else {
                    // Solo hay una fecha, realizar la comprobación correspondiente.
                    return (
                        reserva.cedula == this.documento ||
                        reserva.telefono == this.telefono ||
                        (this.fechaLLegada && reserva.fechaEntrada >= this.fechaLLegada) ||
                        (this.fechaSalida && reserva.fechaSalida <= this.fechaSalida)
                    )
                }
            })
        },
        /**
         * Formatea un número agregando comas para separar miles y acepta decimales.
         * @param {number} numero - Número que se formateará.
         * @returns {string} Número formateado con comas.
         */
        comaEnMiles(numero) {
            // Convertir el número a cadena y dividir la parte entera de la parte decimal
            let partes = numero.toString().split(',');

            // Expresión regular para agregar comas a la parte entera
            let expParteEntera = /(\d)(?=(\d{3})+(?!\d))/g;
            let repParteEntera = '$1.';

            // Formatear la parte entera y agregar la parte decimal si existe
            let parteEnteraFormateada = partes[0].replace(expParteEntera, repParteEntera);
            let resultado = partes.length === 2 ? parteEnteraFormateada + ',' + partes[1] : parteEnteraFormateada;

            return resultado;
        },
    },
    mounted() {
        this.getReservas()
    },
}
</script>

<style scoped></style>