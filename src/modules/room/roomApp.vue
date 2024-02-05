<template>
    <div class="content">
        <h1>
            Consultar Habitaciones
        </h1>
        <v-card width="90%" class="my-5">
            <v-card-title>
                <v-row>
                    <v-col cols="12" md="10">
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                            hide-details></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-btn class="mx-5" @click="dialogCreate = true" color="primary">
                            <v-icon>mdi-plus-circle</v-icon> agregar
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-data-table :headers="headers" :items="rooms" :search="search" :loading="loading"
                no-results-text="No hay ninguna habitacion que coincida" no-data-text="No hay habitaciones"
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
                                    <v-list-item link @click="room = item, dialogPrecios = true">
                                        <v-list-item-title v-text="'Tarifas'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="room = item, dialogTarifasExtra = true">
                                        <v-list-item-title v-text="'Tarifas Adicionales'"></v-list-item-title>
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
                        <td>{{ item.estado }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
        <DialogCreate :show="dialogCreate" @close="close" @create="getRooms"></DialogCreate>
        <DialogUpdate :show="dialogUpdate" :room="room" @close="close" @update="getRooms"></DialogUpdate>
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
        <DialogImg :show="dialogImg" :room="room" @close="dialogImg = false" @update="getRooms(), dialogImg = false">
        </DialogImg>
        <v-dialog :value="dialogTarifasExtra" width="90%" max-width="500px" persistent>
            <v-card class="pa-5">
                <v-form v-model="valid" @submit.prevent="saveTarifasExtra">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="Adicional" label="Tarifa Personal"
                                :rules="[rules.required, rules.numerico]" @input="formatNumber('Adicional', Adicional)"
                                outlined required>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="Niños" label="Tarifa Niños" :rules="[rules.required, rules.numerico]"
                                @input="formatNumber('Niños', Niños)" outlined required>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <div class="buttons pt-5">
                        <v-btn @click="dialogTarifasExtra = false" color="blue">cancelar</v-btn>
                        <v-btn :disabled="!valid" type="submit" :loading="loadingbtn" color="light-green">guardar</v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>
        <SimilarRooms :show="dialogRooms" :room="room" @close="dialogRooms = false" @update="getRooms(), dialogRooms = false"/>
    </div>
</template>

<script>

import Swal from 'sweetalert2'
import roomService from "./service/roomService"
import PreciosRoom from './components/PreciosRoom';
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
        DialogCreate,
        DialogUpdate,
        DialogImg,
        SimilarRooms
    },
    watch: {
        room: {
            handler(newRoom) {
                if ("precios" in newRoom) {
                    newRoom.precios.map((day) => {
                        if (day.name == 'Adicional' || day.name == 'Niños') {
                            this[day.name] = this.comaEnMiles(day.precio)
                        } else {
                            this.Adicional = 0
                            this.Niños = 0
                        }
                    })
                }
            },
            immediate: true,
        }
    },
    data() {
        return {
            search: '',
            Adicional: '',
            Niños: '',
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
            valid: false,
            room: {},
            rooms: [],
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Nombre', key: 'nombre', value: 'nombre' },
                { text: 'Descripción', key: 'descripcion', value: 'descripcion' },
                { text: 'Tipo', key: 'tipo', value: 'tipo' },
                { text: 'Capacidad', key: 'capacidad', value: 'capacidad' },
                { text: 'estado', key: 'estado', value: 'estado' },
            ],
            rules: {
                required: value => !!value || 'Campo requerido.',
                numerico: value => /^[0-9.]+$/.test(value) || "Solo se admiten números y puntos."
            },
        }
    },
    methods: {
        getRooms() {
            this.loading = true
            this.room = {}
            this.close()

            roomService.obtenerRooms()
                .then(res => {
                    this.loading = false
                    this.rooms = res
                })
                .catch(err => {
                    this.loading = false
                    console.log(err)
                })
        },
        deleted() {
            this.loadingbtn = true

            roomService.eliminarRoom(this.room.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogDelete = false
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
                    console.log(err)
                })
        },
        saveTarifasExtra() {
            this.loadingbtn = true

            let week = [
                {
                    name: 'Adicional',
                    precio: parseInt(this.Adicional.replace(/\./g, '')),
                    jornada_id: null,
                },
                {
                    name: 'Niños',
                    precio: parseInt(this.Niños.replace(/\./g, '')),
                    jornada_id: null,
                },
            ]

            let data = {
                weekdays: week
            }

            roomService.savePrecios(data, this.room.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogTarifasExtra = false
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
        },
        comaEnMiles(numero) {
            let exp = /(\d)(?=(\d{3})+(?!\d))/g //* expresion regular que busca tres digitos
            let rep = '$1.' //parametro especial para splice porque los numeros no son menores a 100
            return numero.toString().replace(exp, rep)
        },
        formatNumber(campo, precio) {
            let formattedNumber = precio.replace(/\D/g, '');
            this[campo] = this.comaEnMiles(formattedNumber);
        },
        close() {
            this.dialogCreate = false
            this.dialogUpdate = false
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