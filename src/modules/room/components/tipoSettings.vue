<template>
    <v-card width="90%" class="my-5" elevation="5">
        <v-card-title>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                hide-details></v-text-field>
            <v-btn class="mx-5" @click="dialogCreate = true" color="primary">
                <v-icon>mdi-plus-circle</v-icon> agregar
            </v-btn>
        </v-card-title>
        <v-data-table :headers="headers" :items="desserts" :search="search" :loading="loading"
            no-results-text="No hay ningún tipo de habitacion que coincida" no-data-text="No hay habitaciones"
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
                                <v-list-item link @click="type = item, dialogUpdate = true">
                                    <v-list-item-title v-text="'Ajustes'"></v-list-item-title>
                                </v-list-item>
                                <v-list-item link @click="type = item, dialogDelete = true">
                                    <v-list-item-title v-text="'Eliminar'"></v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </td>
                    <td>{{ item.tipo }}</td>
                    <td>{{ item.created_at }}</td>
                </tr>
            </template>
        </v-data-table>
        <v-dialog :value="dialogCreate" width="90%" max-width="500px" persistent>
            <v-card class="pa-5">
                <v-toolbar elevation="0">
                    <v-spacer />
                    <v-btn icon class="ml-3" @click="dialogCreate = false">
                        <v-icon>mdi-close-box</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-form ref="formCreate" v-model="validCreate" @submit.prevent="newTipo">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="newtipo" :rules="[rules.required]" outlined required>

                                <template v-slot:label>
                                    Tipo <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <div class="buttons">
                        <v-btn @click="dialogCreate = false, $refs.formCreate.reset()" color="blue">
                            cancelar
                        </v-btn>
                        <v-btn :disabled="!validCreate" type="submit" :loading="loadingbtn" class="light-green black--text">
                            crear
                        </v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>

        <v-dialog :value="dialogUpdate" width="90%" max-width="500px" persistent>
            <v-card class="pa-5">
                <v-toolbar elevation="0">
                    <v-spacer />
                    <v-btn icon class="ml-3" @click="dialogUpdate = false">
                        <v-icon>mdi-close-box</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-form ref="formUpdate" v-model="validUpdate" @submit.prevent="updateTipo">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="tipo" :rules="[rules.required]" outlined required>

                                <template v-slot:label>
                                    Tipo <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <div class="buttons">
                        <v-btn @click="dialogUpdate = false" color="blue">
                            cancelar
                        </v-btn>
                        <v-btn :disabled="!validUpdate" type="submit" :loading="loadingbtn" class="light-green black--text">
                            actualizar
                        </v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>

        <v-dialog :value="dialogDelete" width="90%" max-width="500px" persistent>
            <v-card class="pb-5">
                <v-toolbar elevation="0">
                    <v-spacer />
                    <v-btn icon class="ml-3" @click="dialogDelete = false">
                        <v-icon>mdi-close-box</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-sheet class="d-flex justify-center align-center flex-column">
                    <h3 class="mb-5">
                        Eliminar el tipo {{ type.tipo }}?
                    </h3>
                    <div class="buttons">
                        <v-btn @click="dialogDelete = false" color="error" class="white--text text--accent-4">
                            cancelar
                        </v-btn>
                        <v-btn @click="eliminar" :loading="loadingbtn" color="primary">
                            eliminar
                        </v-btn>
                    </div>
                </v-sheet>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>

import Swal from 'sweetalert2'
import service from '@/services/service'

export default {
    name: 'tipoSettings',
    watch: {
        // Observa cambios en la propiedad 'type'
        type: {
            // Manejador que se ejecutará cuando se detecten cambios en 'type'
            handler(newtype) {
                // Actualiza la propiedad 'tipo' con el valor de 'newtype.tipo'
                this.tipo = newtype.tipo;
            },
            // Indica que se debe ejecutar el 'handler' inmediatamente después de la creación del componente
            immediate: true,
        }
    },
    data() {
        return {
            search: '',
            newtipo: '',
            tipo: '',
            loading: false,
            loadingbtn: false,
            validCreate: false,
            validUpdate: false,
            dialogCreate: false,
            dialogUpdate: false,
            dialogDelete: false,
            desserts: [],
            type: {},
            rules: {
                required: value => !!value || 'Campo requerido.',
            },
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Tipo', key: 'tipo', value: 'tipo' },
                { text: 'Creado', key: 'created_at', value: 'created_at' },
            ],
        }
    },
    methods: {
        /**
         * Crea un nuevo tipo de habitación.
         */
        newTipo() {
            this.loadingbtn = true

            // Prepara los datos para enviar al servidor
            let data = {
                tipo: this.newtipo,
            }

            // Llama al servicio para crear un nuevo tipo de habitación
            service.crearTipoRoom(data)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogCreate = false
                    this.getTipos() // Actualiza la lista de tipos después de crear uno nuevo
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
                    console.error(err)
                })
        },
        /**
         * Obtiene la lista de tipos de habitación.
         */
        getTipos() {
            this.loading = true

            // Llama al servicio para obtener la lista de tipos de habitación
            service.obtenerTiposRoom()
                .then(res => {
                    this.loading = false
                    this.desserts = res
                })
                .catch(err => {
                    this.loading = false
                    console.error(err)
                })
        },
        /**
         * Actualiza un tipo de habitación existente.
         */
        updateTipo() {
            this.loadingbtn = true

            // Prepara los datos para enviar al servidor
            let data = {
                tipo: this.tipo,
            }

            // Llama al servicio para actualizar un tipo de habitación existente
            service.actualizarTipoRoom(data, this.type.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogUpdate = false
                    this.getTipos() // Actualiza la lista de tipos después de la actualización
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
         * Elimina un tipo de habitación.
         */
        eliminar() {
            this.loadingbtn = true

            // Llama al servicio para eliminar un tipo de habitación
            service.eliminarTipoRoom(this.type.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogDelete = false
                    this.getTipos() // Actualiza la lista de tipos después de la eliminación
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
        this.getTipos()
    },
}
</script>

<style scoped></style>