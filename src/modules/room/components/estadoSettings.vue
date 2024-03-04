<template>
    <v-card class="my-5">
        <v-card-title>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details></v-text-field>
            <v-btn class="mx-5" @click="dialogCreate = true" color="primary">
                <v-icon>mdi-plus-circle</v-icon> agregar
            </v-btn>
        </v-card-title>
        <v-data-table :headers="headers" :items="desserts" :search="search" :loading="loading"
            no-results-text="No hay ningún estado de habitacion que coincida" no-data-text="No hay habitaciones"
            loading-text="Cargando... Por favor espera"
            :footer-props="{ itemsPerPageText: 'Número de filas', pageText: '{0}-{1} de {2}' }">
            <template v-slot:item="{ item }">
                <tr>
                    <td>
                        <v-menu v-if="item.created_at" :offset-x="true" transition="scale-transition">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on">
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item link @click="estate = item, dialogUpdate = true">
                                    <v-list-item-title v-text="'Ajustes'"></v-list-item-title>
                                </v-list-item>
                                <v-list-item link @click="estate = item, dialogDelete = true">
                                    <v-list-item-title v-text="'Eliminar'"></v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </td>
                    <td>{{ item.estado }}</td>
                    <td>{{ item.created_at }}</td>
                </tr>
            </template>
        </v-data-table>
        <v-dialog :value="dialogCreate" width="90%" max-width="500px" persistent>
            <v-card class="pa-5">
                <v-form ref="formCreate" v-model="validCreate" @submit.prevent="newEstado">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="newestado" :rules="[rules.required]" outlined required>
                                <template v-slot:label>
                                    Estado <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <div class="buttons">
                        <v-btn @click="dialogCreate = false, $refs.formCreate.reset()" color="blue">cancelar</v-btn>
                        <v-btn :disabled="!validCreate" type="submit" :loading="loadingbtn"
                            color="light-green">crear</v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>
        <v-dialog :value="dialogUpdate" width="90%" max-width="500px" persistent>
            <v-card class="pa-5">
                <v-form ref="formUpdate" v-model="validUpdate" @submit.prevent="updateEstado">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="estado" :rules="[rules.required]" outlined required>
                                <template v-slot:label>
                                    Estado <span class="red--text">*</span>
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
                    <h3>Eliminar el estado {{ estate.estado }}?</h3>
                    <div class="buttons">
                        <v-btn @click="dialogDelete = false" color="error"
                            class="white--text text--accent-4">cancelar</v-btn>
                        <v-btn @click="deleted" :loading="loadingbtn" color="primary">eliminar</v-btn>
                    </div>
                </v-sheet>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>

import Swal from 'sweetalert2'
import roomService from '../service/roomService'

export default {
    name: 'estadoSettings',
    watch: {
        estate: {
            handler(newEstate) {
                this.estado = newEstate.estado;
            },
            immediate: true,
        }
    },
    data() {
        return {
            search: '',
            newestado: '',
            estado: '',
            loading: false,
            loadingbtn: false,
            validCreate: false,
            validUpdate: false,
            dialogCreate: false,
            dialogUpdate: false,
            dialogDelete: false,
            desserts: [],
            estate: {},
            rules: {
                required: value => !!value || 'Campo requerido.',
            },
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Estado', key: 'estado', value: 'estado' },
                { text: 'Creado', key: 'created_at', value: 'created_at' },
            ],
        }
    },
    methods: {
        /**
         * Crea un nuevo estado de habitación con la información proporcionada en el formulario.
         * Muestra un mensaje de éxito o error después de la operación, cierra el diálogo de creación y actualiza la lista de estados.
         */
        newEstado() {
            this.loadingbtn = true

            let data = {
                estado: this.newestado,
            }

            roomService.crearEstadoRoom(data)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogCreate = false
                    this.getEstados()
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
                    console.error(err)
                })
        },
        /**
         * Obtiene la lista de estados de habitación y actualiza la propiedad correspondiente.
         */
        getEstados() {
            this.loading = true

            roomService.obtenerEstadosRoom()
                .then(res => {
                    this.loading = false
                    this.desserts = res
                })
                .catch(err => {
                    console.error(err)
                    this.loading = false
                })
        },
        /**
         * Actualiza el estado de habitación con la información proporcionada en el formulario.
         * Muestra un mensaje de éxito o error después de la operación, cierra el diálogo de actualización y actualiza la lista de estados.
         */
        updateEstado() {
            this.loadingbtn = true

            let data = {
                estado: this.estado,
            }

            roomService.actualizarEstadoRoom(data, this.estate.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogUpdate = false
                    this.getEstados()
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
         * Elimina el estado de habitación seleccionado.
         * Muestra un mensaje de éxito o error después de la operación, cierra el diálogo de eliminación y actualiza la lista de estados.
         */
        deleted() {
            this.loadingbtn = true

            roomService.eliminarEstadoRoom(this.estate.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogDelete = false
                    this.getEstados()
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
    },
    mounted() {
        this.getEstados()
    },
}
</script>

<style scoped></style>