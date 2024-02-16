<template>
    <div class="content">
        <h1>
            Desayunos
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
                no-results-text="No hay ningún desayuno que coincida" no-data-text="No hay desayunos"
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
                                    <v-list-item link @click="breakfast = item, dialogUpdate = true">
                                        <v-list-item-title v-text="'Ajustes'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="breakfast = item, dialogDelete = true">
                                        <v-list-item-title v-text="'Eliminar'"></v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                        <td>{{ item.desayuno }}</td>
                        <td>{{ item.created_at }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog :value="dialogCreate" width="90%" max-width="500px" persistent>
            <v-card class="pa-5">
                <v-form ref="formCreate" v-model="validCreate" @submit.prevent="crear">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="newDesayuno" :rules="[rules.required]" outlined required>
                                <template v-slot:label>
                                    Nombre <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <div class="buttons">
                        <v-btn @click="dialogCreate = false, $refs.formCreate.reset()" color="blue">cancelar</v-btn>
                        <v-btn :disabled="!validCreate" :loading="loadingbtn" type="submit"
                            color="light-green">crear</v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>
        <v-dialog :value="dialogUpdate" width="90%" max-width="500px" persistent>
            <v-card class="pa-5">
                <v-form ref="formUpdate" v-model="validUpdate" @submit.prevent="actualizar">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="desayuno" :rules="[rules.required]" outlined required>
                                <template v-slot:label>
                                    Nombre <span class="red--text">*</span>
                                </template>
                            </v-text-field>
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
                    <h3>Eliminar el desayuno {{ breakfast.desayuno }}?</h3>
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

export default {
    name: 'desayunosApp',
    components: {
    },
    data() {
        return {
            search: '',
            newDesayuno: '',
            desayuno: '',
            loading: false,
            loadingbtn: false,
            dialogCreate: false,
            dialogUpdate: false,
            dialogDelete: false,
            validCreate: false,
            validUpdate: false,
            breakfast: {},
            desserts: [],
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Desayuno', key: 'desayuno', value: 'desayuno' },
                { text: 'Creado', key: 'created_at', value: 'created_at' },
            ],
            rules: {
                required: value => !!value || 'Campo requerido.',
            },
        }
    },
    watch: {
        breakfast: {
            handler(newitem) {
                this.desayuno = newitem.desayuno;
            },
            immediate: true,
        }
    },
    methods: {
        /**
         * Crea un nuevo desayuno.
         */
        crear() {
            this.loadingbtn = true

            // Prepara los datos para enviar al servidor
            let data = {
                desayuno: this.newDesayuno,
            }

            // Llama al servicio para crear un nuevo desayuno
            roomService.crearDesayuno(data)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogCreate = false
                    this.getDesayunos() // Actualiza la lista de desayunos después de crear uno nuevo
                    this.$refs.formCreate.reset() // Reinicia el formulario
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
        /**
         * Obtiene la lista de desayunos.
         */
        getDesayunos() {
            this.loading = true
            this.breakfast = {}

            // Llama al servicio para obtener la lista de desayunos
            roomService.obtenerDesayunos()
                .then(res => {
                    this.loading = false
                    this.desserts = res
                })
                .catch(err => {
                    this.loading = false
                    console.log(err)
                })
        },
        /**
         * Actualiza un desayuno existente.
         */
        actualizar() {
            this.loadingbtn = true

            // Prepara los datos para enviar al servidor
            let data = {
                desayuno: this.desayuno,
            }

            // Llama al servicio para actualizar un desayuno existente
            roomService.actualizarDesayuno(data, this.breakfast.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogUpdate = false
                    this.getDesayunos() // Actualiza la lista de desayunos después de la actualización
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
        /**
         * Elimina un desayuno.
         */
        eliminar() {
            this.loadingbtn = true

            // Llama al servicio para eliminar un desayuno
            roomService.eliminarDesayuno(this.breakfast.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogDelete = false
                    this.getDesayunos() // Actualiza la lista de desayunos después de la eliminación
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
    },
    mounted() {
        this.getDesayunos()
    },
}
</script>

<style scoped></style>