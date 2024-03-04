<template>
    <div class="content">
        <h1>
            Consultar Habitaciones
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
                                    <v-list-item link @click="room = item, dialogUpdate = true">
                                        <v-list-item-title v-text="'Ajustes'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="room = item, dialogImg = true">
                                        <v-list-item-title v-text="'Imagenes'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="room = item, dialogRooms = true">
                                        <v-list-item-title v-text="'Habitaciones'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="room = item, dialogBitacora = true">
                                        <v-list-item-title v-text="'Bitacora'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="room = item, dialogDelete = true">
                                        <v-list-item-title v-text="'Eliminar'"></v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                        <td>{{ item.nombre }}</td>
                        <td class="max-width">
                            <p class="descripcion">
                                {{ item.descripcion }}
                            </p>
                        </td>
                        <td>{{ item.tipo }}</td>
                        <td>{{ item.capacidad }}</td>
                        <td>{{ item.countRooms }}</td>
                        <td>{{ item.estado }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
        <DialogCreate :show="dialogCreate" @close="dialogCreate = false" @create="getRooms(), dialogCreate = false" />
        <DialogUpdate :show="dialogUpdate" :room="room" @close="dialogUpdate = false"
            @update="getRooms(), dialogUpdate = false" />
        <v-dialog :value="dialogDelete" width="90%" max-width="500px" persistent>
            <v-card>
                <v-sheet class="d-flex justify-center align-center flex-column pa-5">
                    <h3>Eliminar la habitación {{ room.nombre }}?</h3>
                    <div class="buttons">
                        <v-btn @click="dialogDelete = false" color="error"
                            class="white--text text--accent-4">cancelar</v-btn>
                        <v-btn @click="deleted" :loading="loadingbtn" color="primary">eliminar</v-btn>
                    </div>
                </v-sheet>
            </v-card>
        </v-dialog>
        <estadosRoom :show="dialogBitacora" :id="room.id" @close="dialogBitacora = false"></estadosRoom>
        <PreciosRoom :show="dialogPrecios" :id="room.id" @close="dialogPrecios = false"
            @update="getRooms(), dialogPrecios = false"></PreciosRoom>
        <PreciosExtra :show="dialogTarifasExtra" :room="room" @close="dialogTarifasExtra = false"
            @update="getRooms(), dialogTarifasExtra = false" />
        <DialogImg :show="dialogImg" :room="room" @close="dialogImg = false" @update="getRooms(), dialogImg = false">
        </DialogImg>
        <SimilarRooms :show="dialogRooms" :room="room" @close="dialogRooms = false"
            @update="getRooms(), dialogRooms = false" />
    </div>
</template>

<script>

import Swal from 'sweetalert2'
import roomService from "./service/roomService"
import PreciosRoom from './components/PreciosRoom';
import PreciosExtra from './components/PreciosExtra';
import estadosRoom from "./components/estadosRoom"
import DialogCreate from "./components/DialogCreate";
import DialogUpdate from "./components/DialogUpdate";
import DialogImg from './components/DialogImg.vue';
import SimilarRooms from './components/SimilarRooms.vue';

export default {
    name: 'roomApp',
    components: {
        estadosRoom,
        PreciosRoom,
        PreciosExtra,
        DialogCreate,
        DialogUpdate,
        DialogImg,
        SimilarRooms
    },
    data() {
        return {
            search: '',
            loading: false,
            loadingbtn: false,
            dialogCreate: false,
            dialogUpdate: false,
            dialogDelete: false,
            dialogBitacora: false,
            dialogPrecios: false,
            dialogTarifasExtra: false,
            dialogImg: false,
            dialogRooms: false,
            room: {},
            rooms: [],
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Nombre', key: 'nombre', value: 'nombre' },
                { text: 'Descripción', key: 'descripcion', value: 'descripcion' },
                { text: 'Tipo', key: 'tipo', value: 'tipo' },
                { text: 'Capacidad', key: 'capacidad', value: 'capacidad' },
                { text: 'Cantidad De Habitaciones', key: 'countRooms', value: 'countRooms' },
                { text: 'estado', key: 'estado', value: 'estado' },
            ],
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
            roomService.obtenerRooms()
                .then(res => {
                    this.loading = false
                    this.rooms = res
                })
                .catch(err => {
                    this.loading = false
                    console.error(err)
                })
        },
        /**
         * Elimina una habitación.
         */
        deleted() {
            this.loadingbtn = true

            // Llama al servicio para eliminar una habitación
            roomService.eliminarRoom(this.room.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogDelete = false
                    this.getRooms() // Actualiza la lista de habitaciones después de la eliminación
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
    },
    mounted() {
        this.getRooms()
    },
}
</script>

<style scoped>
.max-width {
    max-width: 500px;
}

.descripcion {
    margin: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    height: calc(1.2em * 2);
    line-height: 1.2em;
}
</style>