<template>
    <div class="content">
        <h1>
            Tarifas Otas
        </h1>
        <v-card width="90%" elevation="5" class="my-5">
            <v-card-title>
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                            hide-details></v-text-field>
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
                                    <v-list-item link @click="room = item, dialogPrecio = true">
                                        <v-list-item-title v-text="'Valor OTAS'"></v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                        <td>{{ item.nombre }}</td>
                        <td>{{ item.countRooms }}</td>
                        <td>{{ item.cantidadOtas }}</td>
                        <td>
                            <span v-if="item.tarifaOta.tipo == 'Precio'">$</span>
                            {{ comaEnMiles(item.tarifaOta.precio) }}
                            <span v-if="item.tarifaOta.tipo == 'Porcentaje'">%</span>
                        </td>
                    </tr>
                </template>

            </v-data-table>
        </v-card>

        <v-dialog :value="dialogPrecio" width="90%" max-width="500px" persistent>
            <v-card class="pa-5">
                <v-form ref="formCreate" v-model="valid" @submit.prevent="saveTarifaOta">
                    <v-row>

                        <v-col cols="12">
                            <v-select v-model="tipo" :items="tipos" :rules="[rules.required]" item-text="tipo"
                                item-value="id" outlined required>

                                <template v-slot:label>
                                    Tipo <span class="red--text">*</span>
                                </template>
                            </v-select>
                        </v-col>

                        <v-col cols="12">
                            <v-slider v-if="tipo == 'Porcentaje'" v-model="precio" max="100" min="0" label="Precio"
                                thumb-label="always">
                                <template v-slot:thumb-label="{ value }">
                                    {{ value }}%
                                </template>
                            </v-slider>

                            <v-text-field v-if="tipo == 'Precio'" v-model="precio" v-price :rules="[rules.required]"
                                @input="formatNumber('precio', precio)" outlined required>

                                <template v-slot:label>
                                    Precio <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                    </v-row>

                    <div class="buttons">
                        <v-btn @click="dialogPrecio = false" color="blue">cancelar</v-btn>
                        <v-btn :disabled="!valid" :loading="loadingbtn" type="submit" color="light-green">guardar</v-btn>
                    </div>

                </v-form>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>

import Swal from 'sweetalert2'
import service from '@/services/service'

export default {
    name: 'roomTarifas',
    watch: {
        room: {
            handler(newRoom) {
                if ("id" in newRoom) {
                    this.precio = this.comaEnMiles(newRoom.tarifaOta.precio)
                    this.tipo = newRoom.tarifaOta.tipo
                }
            },
            immediate: true,
        }
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
            precio: '',
            tipo: 'Porcentaje',
            valid: false,
            loading: false,
            loadingbtn: false,
            dialogPrecio: false,
            room: {},
            rooms: [],
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Nombre', key: 'nombre', value: 'nombre' },
                { text: 'Cantidad', key: 'cantidad', value: 'countRooms' },
                { text: 'Cantidad OTAS', key: 'cantidadOtas', value: 'cantidadOtas' },
                { text: 'Precio OTAS', align: 'center', key: 'otas', value: 'precios[0].precio' },
            ],
            tipos: [
                'Porcentaje',
                'Precio',
            ],
            rules: {
                required: value => !!value || 'Campo requerido.',
                numerico: value => /^[0-9.]+$/.test(value) || "Solo se admiten números y puntos."
            },
        }
    },
    methods: {
        saveTarifaOta() {
            this.loadingbtn = true

            if (typeof (this.precio) == 'string') {
                this.precio = parseInt(this.precio.replace(/\./g, ''))
            }

            let data = {
                room: this.room.id,
                precio: this.precio,
                porcentaje: this.tipo == 'Porcentaje',
            }

            service.guardarTarifaOtas(data)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogPrecio = false
                    this.getRooms()
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    this.loadingbtn = false
                    Swal.fire({
                        icon: 'error',
                        text: err.response.data.message,
                    })
                })
        },
        /**
         * Obtiene la lista de habitaciones.
         */
        getRooms() {
            // Establece la variable de carga como verdadera para mostrar el estado de carga
            this.loading = true

            // Reinicia la habitación seleccionada
            this.room = {}

            // Llama al servicio para obtener la lista de habitaciones
            service.obtenerAllRooms()
                .then(res => {
                    // Establece la variable de carga como falsa una vez que se completa la solicitud
                    this.loading = false

                    res.map(room => {
                        if (room.tarifaOta == null) room.tarifaOta = {
                            precio: 0,
                            tipo: 'Porcentaje'
                        }
                    })

                    // Asigna las habitaciones obtenidas a la lista local de habitaciones
                    this.rooms = res
                })
                .catch(err => {
                    // Maneja el error imprimiendo un mensaje en la consola
                    this.loading = false
                    console.error(err)
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
        /**
         * Formatea el número de un día de la semana agregando comas para separar miles.
         * @param {object} day - Objeto que representa un día de la semana con un precio.
         */
        formatNumber(value, precio) {
            let formattedNumber = precio.replace(/\D/g, '') // Elimina caracteres no numéricos del precio
            this[value] = this.comaEnMiles(formattedNumber) // Formatea el número con comas
        },
    },
    mounted() {
        this.getRooms()
    },
}
</script>

<style scoped></style>