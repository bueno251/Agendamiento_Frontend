<template>
    <div class="content">
        <h1>
            Caracteristicas
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
            <v-data-table :headers="headers" :items="desserts" :search="search" :loading="loading"
                no-results-text="No hay ninguna caraccteristica que coincida" no-data-text="No hay caracteristicas"
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
                                    <v-list-item link @click="caracteristica = item, dialogUpdate = true">
                                        <v-list-item-title v-text="'Ajustes'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="caracteristica = item, dialogDelete = true">
                                        <v-list-item-title v-text="'Eliminar'"></v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                        <td>
                            <v-avatar color="indigo" size="36">
                                <v-icon dark>
                                    mdi-{{ item.icon }}
                                </v-icon>
                            </v-avatar>
                        </td>
                        <td>{{ item.nombre }}</td>
                        <td>{{ item.descripcion }}</td>
                        <td>{{ item.estado }}</td>
                        <td>{{ item.created_at }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
        <CreateCaracteristicRoom :show="dialogCreate" @close="dialogCreate = false"
            @create="getCaracteristicas(), dialogCreate = false">
        </CreateCaracteristicRoom>

        <v-dialog :value="dialogUpdate" width="90%" max-width="500px" persistent>
            <v-card class="pa-5">
                <v-form ref="formUpdate" v-model="validUpdate" @submit.prevent="actualizar">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="nombre" :rules="[rules.required]" outlined required>
                                <template v-slot:label>
                                    Nombre <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-text-field v-model="icon" :rules="[rules.required]" :append-icon="`mdi-${icon}`"
                                append-outer-icon="mdi-help-circle-outline" @click:append-outer="toIcons" outlined required>
                                <template v-slot:label>
                                    Icono <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-select v-model="estado" :items="estados" no-data-text="Espere un momento..."
                                :rules="[rules.required]" item-text="estado" item-value="id" outlined>
                                <template v-slot:label>
                                    Estado <span class="red--text">*</span>
                                </template>
                            </v-select>
                        </v-col>

                        <v-col cols="12">
                            <v-textarea v-model="descripcion" :rules="[rules.required]" auto-grow rows="5" dense outlined
                                required>
                                <template v-slot:label>
                                    Descripción <span class="red--text">*</span>
                                </template>
                            </v-textarea>
                        </v-col>
                    </v-row>
                    <div class="buttons">
                        <v-btn @click="dialogUpdate = false" color="blue">cancelar</v-btn>
                        <v-btn :disabled="!validUpdate" type="submit" :loading="loadingbtn"
                            color="light-green">actualizar</v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>

        <v-dialog :value="dialogDelete" width="90%" max-width="500px" persistent>
            <v-card>
                <v-sheet class="d-flex justify-center align-center flex-column pa-5">
                    <h3>Eliminar la decoración {{ caracteristica.nombre }}?</h3>
                    <div class="buttons">
                        <v-btn @click="dialogDelete = false" color="error"
                            class="white--text text--accent-4">cancelar</v-btn>
                        <v-btn @click="eliminar" :loading="loadingbtn" color="primary">eliminar</v-btn>
                    </div>
                </v-sheet>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import Swal from 'sweetalert2'
import roomService from "./service/roomService"
import CreateCaracteristicRoom from './components/CreateCaracteristicRoom.vue'

export default {
    name: 'CaracteristicasApp',
    components: {
        CreateCaracteristicRoom,
    },
    data() {
        return {
            search: '',
            nombre: '',
            descripcion: '',
            icon: '',
            estado: '',
            loading: false,
            loadingbtn: false,
            dialogCreate: false,
            dialogUpdate: false,
            dialogDelete: false,
            validCreate: false,
            validUpdate: false,
            caracteristica: {},
            desserts: [],
            estados: [
                {
                    id: 1,
                    estado: 'Activo',
                },
                {
                    id: 2,
                    estado: 'Inactivo',
                },
            ],
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Icono', key: 'icon', sortable: false },
                { text: 'Nombre', key: 'nombre', value: 'nombre' },
                { text: 'Descripcion', key: 'descripcion', value: 'descripcion' },
                { text: 'Estado', key: 'estado', value: 'estado' },
                { text: 'Creado', key: 'created_at', value: 'created_at' },
            ],
            rules: {
                required: value => !!value || 'Campo requerido.',
            },
        }
    },
    watch: {
        caracteristica: {
            handler(newitem) {
                if (newitem.id) {
                    this.nombre = newitem.nombre
                    this.icon = newitem.icon
                    this.descripcion = newitem.descripcion
                    this.estado = newitem.estado_id
                }
            },
            immediate: true,
        }
    },
    methods: {
        crear() {
            this.loadingbtn = true

            let data = {
                nombre: this.nombre,
                descripcion: this.descripcion,
                icon: this.icon,
                estado: this.estado,
            }

            roomService.crearCaracteristica(data)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogCreate = false
                    this.getCaracteristicas()
                    this.$refs.formCreate.reset()
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
        getCaracteristicas() {
            this.loading = true
            this.caracteristica = {}

            roomService.obtenerCaracteristicas()
                .then(res => {
                    this.loading = false
                    this.desserts = res
                })
                .catch(err => {
                    this.loading = false
                    console.log(err)
                })
        },
        actualizar() {
            this.loadingbtn = true

            let data = {
                nombre: this.nombre,
                descripcion: this.descripcion,
                icon: this.icon,
                estado: this.estado,
            }

            roomService.actualizarCaracteristica(data, this.caracteristica.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogUpdate = false
                    this.getCaracteristicas()
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
        eliminar() {
            this.loadingbtn = true

            roomService.eliminarCaracteristica(this.caracteristica.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogDelete = false
                    this.getCaracteristicas()
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
        toIcons() {
            window.open('https://pictogrammers.com/library/mdi/', '_blank');
        }
    },
    mounted() {
        this.getCaracteristicas()
    },
}
</script>

<style scoped></style>