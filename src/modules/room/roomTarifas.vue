<template>
    <div class="content">
        <h1>
            Tarifas Habitaciones
        </h1>
        <v-card width="90%" class="my-5">
            <v-card-title>
                <v-row>
                    <v-col cols="12" md="10" sm="8">
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                            hide-details></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2" sm="4">
                        <v-btn class="mx-5" @click="dialogCreate = true" color="primary">
                            <v-icon>mdi-plus-circle</v-icon> agregar
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-data-table :headers="headers" :items="rooms" :search="search" :loading="loading"
                no-results-text="No hay ningúna habitacion que coincida" no-data-text="No hay habitaciones"
                loading-text="Cargando... Por favor espera"
                :footer-props="{ itemsPerPageText: 'Número de filas', pageText: '{0}-{1} de {2}' }">
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
                                    <v-list-item link @click="room = item, dialogPrecios = true">
                                        <v-list-item-title v-text="'Tarifas'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="room = item, dialogTarifasExtra = true">
                                        <v-list-item-title v-text="'Tarifas Adicionales'"></v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                        <td>{{ item.nombre }}</td>
                        <td v-for="tarifa in item.precios" :key="`td-${tarifa.name}`">
                            <v-edit-dialog :return-value.sync="tarifa.precio"
                                @save="save(tarifa.precio, tarifa.name, item.id, tarifa.jornada_id)">

                                <div class="d-flex justify-center">
                                    ${{ comaEnMiles(tarifa.precio) }}
                                </div>

                                <template v-slot:input>
                                    <v-text-field v-model="tarifa.precio" :rules="[rules.required]" v-price
                                        @input="formatNumber(tarifa)" label="Precio" single-line>
                                    </v-text-field>
                                </template>

                            </v-edit-dialog>
                        </td>
                    </tr>
                </template>

            </v-data-table>
        </v-card>

        <PreciosRoom :show="dialogPrecios" :id="room.id" @close="dialogPrecios = false"
            @update="getRooms(), dialogPrecios = false"></PreciosRoom>
        <PreciosExtra :show="dialogTarifasExtra" :room="room" @close="dialogTarifasExtra = false"
            @update="getRooms(), dialogTarifasExtra = false" />
    </div>
</template>

<script>

import Swal from 'sweetalert2'
import service from '@/services/service'
import PreciosRoom from './components/PreciosRoom.vue'
import PreciosExtra from './components/PreciosExtra.vue'

export default {
    name: 'roomTarifas',
    components: {
        PreciosRoom,
        PreciosExtra,
    },
    directives: {
        'price': {
            // Se ejecuta al momento de vincular la directiva al elemento del DOM
            bind(el) {
                // Agrega un evento de escucha para el evento de entrada ('input')
                el.addEventListener('input', (event) => {
                    // Obtiene el nuevo valor después de eliminar no dígitos del evento
                    const newValue = event.target.value.replace(/\D/g, '')

                    // Define la expresión regular y el patrón de reemplazo para formatear el número con comas
                    let exp = /(\d)(?=(\d{3})+(?!\d))/g
                    let rep = '$1.'

                    // Aplica el formato al nuevo valor y actualiza el valor del elemento del DOM
                    event.target.value = newValue.toString().replace(exp, rep)
                })
            }
        },
    },
    data() {
        return {
            search: '',
            loading: false,
            dialogPrecios: false,
            dialogTarifasExtra: false,
            room: {},
            rooms: [],
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Nombre', key: 'nombre', value: 'nombre' },
                { text: 'Domingo', align: 'center', key: 'domingo', value: 'precios[0].precio' },
                { text: 'Lunes', align: 'center', key: 'lunes', value: 'precios[1].precio' },
                { text: 'Martes', align: 'center', key: 'martes', value: 'precios[2].precio' },
                { text: 'Miercoles', align: 'center', key: 'miercoles', value: 'precios[3].precio' },
                { text: 'Jueves', align: 'center', key: 'jueves', value: 'precios[4].precio' },
                { text: 'Viernes', align: 'center', key: 'viernes', value: 'precios[5].precio' },
                { text: 'Sabado', align: 'center', key: 'sabado', value: 'precios[6].precio' },
                { text: 'Persona Extra', align: 'center', key: 'persona', value: 'precios[7].precio' },
                { text: 'Niños Extra', align: 'center', key: 'niños', value: 'precios[8].precio' },
            ],
            rules: {
                required: value => !!value || 'Campo requerido.',
                numerico: value => /^[0-9.]+$/.test(value) || "Solo se admiten números y puntos."
            },
        }
    },
    methods: {
        /**
         * Obtiene la lista de habitaciones.
         */
        getRooms() {
            this.loading = true
            this.room = {}

            // Llama al servicio para obtener la lista de habitaciones
            service.obtenerRooms()
                .then(res => {
                    this.loading = false
                    this.rooms = res

                    this.rooms.map(room => {
                        let week = [
                            { name: 'Domingo', precio: 0, jornada_id: 2 },
                            { name: 'Lunes', precio: 0, jornada_id: 1 },
                            { name: 'Martes', precio: 0, jornada_id: 1 },
                            { name: 'Miércoles', precio: 0, jornada_id: 1 },
                            { name: 'Jueves', precio: 0, jornada_id: 1 },
                            { name: 'Viernes', precio: 0, jornada_id: 1 },
                            { name: 'Sábado', precio: 0, jornada_id: 2 },
                            { name: 'Adicional', precio: 0, jornada_id: null },
                            { name: 'Niños', precio: 0, jornada_id: null },
                        ]

                        room.precios.map(day => {
                            const index = week.findIndex((weekDay) => weekDay.name === day.name);

                            if (index !== -1) {
                                week[index].precio = this.comaEnMiles(day.precio);
                            }
                        })

                        room.precios = week
                    })
                })
                .catch(err => {
                    this.loading = false
                    console.error(err)
                })
        },
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
        /**
         * Formatea el número de un día de la semana agregando comas para separar miles.
         * @param {object} day - Objeto que representa un día de la semana con un precio.
         */
        formatNumber(day) {
            let formattedNumber = day.precio.replace(/\D/g, '') // Elimina caracteres no numéricos del precio
            day.precio = this.comaEnMiles(formattedNumber) // Formatea el número con comas
        },
        save(precio, dia, room, jornada = null) {

            let data = {
                room: room,
                name: dia,
                precio: parseInt(precio.replace(/\./g, '')),
                jornada: jornada,
            }

            service.gurdarTarifa(data)
                .then(res => {
                    this.getRooms()
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    this.loading = false
                    console.error(err)
                })
        },
    },
    mounted() {
        this.getRooms()
    },
}
</script>

<style scoped></style>