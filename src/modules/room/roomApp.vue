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
                                    <v-list-item link @click="room = item, dialogPrecios = true">
                                        <v-list-item-title v-text="'Tarifas'"></v-list-item-title>
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
        <PreciosRoom :show="dialogPrecios" :id="room.id" @close="dialogPrecios = false"></PreciosRoom>
        <DialogImg :show="dialogImg" :room="room" @close="dialogImg = false" @update="getRooms(), dialogImg = false">
        </DialogImg>
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

export default {
    name: 'roomApp',
    components: {
        estadosRoom,
        PreciosRoom,
        DialogCreate,
        DialogUpdate,
        DialogImg,
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
            dialogImg: false,
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
                    res.forEach(room => {
                        room.imgs = JSON.parse(room.imgs)
                    });
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