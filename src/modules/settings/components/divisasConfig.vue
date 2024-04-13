<template>
    <v-card width="90%" elevation="5">
        <v-card-title class="blue lighten-2 white--text">
            <div class="flex">
                <p>
                    Divisas
                </p>

                <v-btn @click="dialogCreate = true">
                    agregar
                </v-btn>
            </div>
        </v-card-title>
        <v-container fluid>
            <v-data-table :headers="headers" :items="divisas" :loading="loading"
                :footer-props="{ itemsPerPageText: 'Número de filas', pageText: '{0}-{1} de {2}' }"
                no-data-text="No hay divisas" loading-text="Cargando... Por favor espera">
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
                                    <v-list-item link @click="divisaSelected = item, dialogUpdate = true">
                                        <v-list-item-title v-text="'Actualizar'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="divisaSelected = item, dialogDelete = true">
                                        <v-list-item-title v-text="'Eliminar'"></v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                        <td>{{ item.nombre }}</td>
                        <td>{{ item.codigo }}</td>
                        <td>{{ item.pais }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-container>

        <v-dialog :value="dialogCreate" width="90%" max-width="500px" persistent>
            <v-card class="pa-5">
                <v-toolbar elevation="0">
                    <v-spacer />
                    <v-btn icon class="ml-3" @click="dialogCreate = false">
                        <v-icon>mdi-close-box</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-form ref="formCreate" v-model="validCreate" @submit.prevent="crear">
                    <v-row>
                        <v-col cols="12">
                            <label>Nombre <span class="red--text">*</span></label>
                            <v-text-field v-model="nombre" :rules="[rules.required]" outlined dense required>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <label>Codigo <span class="red--text">*</span></label>
                            <v-text-field v-model="codigo" :rules="[rules.required]" outlined dense required>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <label>País <span class="red--text">*</span></label>
                            <v-select v-model="pais" :items="paises" no-data-text="Espere un momento..."
                                :rules="[rules.required]" item-text="nombre" item-value="id" outlined dense required>
                            </v-select>
                        </v-col>
                    </v-row>

                    <div class="buttons">
                        <v-btn @click="dialogCreate = false, $refs.formCreate.reset()" color="blue">
                            cancelar
                        </v-btn>
                        <v-btn :disabled="!validCreate" :loading="loadingbtn" type="submit" class="light-green black--text">
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
                <v-form ref="formUpdate" v-model="validUpdate" @submit.prevent="actualizar">
                    <v-row>
                        <v-col cols="12">
                            <label>Nombre <span class="red--text">*</span></label>
                            <v-text-field v-model="nombre" :rules="[rules.required]" outlined dense required>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <label>Codigo <span class="red--text">*</span></label>
                            <v-text-field v-model="codigo" :rules="[rules.required]" outlined dense required>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <label>País <span class="red--text">*</span></label>
                            <v-select v-model="pais" :items="paises" no-data-text="Espere un momento..."
                                :rules="[rules.required]" item-text="nombre" item-value="id" outlined dense required>
                            </v-select>
                        </v-col>
                    </v-row>

                    <div class="buttons">
                        <v-btn @click="dialogUpdate = false" color="blue">
                            cancelar
                        </v-btn>
                        <v-btn :disabled="!validUpdate" :loading="loadingbtn" type="submit" class="light-green black--text">
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
                        Eliminar la divisa {{ divisaSelected.nombre }}?
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
    name: 'divisasConfig',
    watch: {
        divisaSelected: {
            handler(newItem) {
                this.nombre = newItem.nombre
                this.codigo = newItem.codigo
                this.pais = newItem.pais_id
            },
            immediate: true,
        },
    },
    data() {
        return {
            pais: '',
            nombre: '',
            codigo: '',
            validCreate: false,
            validUpdate: false,
            loading: false,
            loadingbtn: false,
            dialogCreate: false,
            dialogUpdate: false,
            dialogDelete: false,
            divisaSelected: {},
            paises: [],
            divisas: [],
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Nombre', key: 'nombre', value: 'nombre' },
                { text: 'Código', key: 'codigo', value: 'codigo' },
                { text: 'País', key: 'pais', value: 'pais' },
            ],
            rules: {
                required: value => !!value || 'Campo requerido.'
            },
        }
    },
    methods: {
        /**
         * Crea una nueva divisa con los datos proporcionados y muestra un mensaje de éxito o error.
         */
        crear() {
            // Establece la variable de carga como verdadera para mostrar el estado de carga
            this.loadingbtn = true

            // Prepara los datos para crear una nueva divisa
            let data = {
                nombre: this.nombre,
                codigo: this.codigo.toUpperCase(),
                pais: this.pais,
            }

            // Llama al servicio para crear una nueva divisa
            service.crearDivisa(data)
                .then(res => {
                    // Establece la variable de carga como falsa y cierra el diálogo de creación de divisa
                    this.loadingbtn = false
                    this.dialogCreate = false

                    // Actualiza la lista de divisas llamando a la función getDivisas()
                    this.getDivisas()

                    // Muestra un mensaje de éxito
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    // Establece la variable de carga como falsa
                    this.loadingbtn = false

                    // Muestra un mensaje de error con el mensaje proporcionado por el servidor
                    Swal.fire({
                        icon: 'error',
                        text: err.response.data.message,
                    })

                    // Registra el error en la consola
                    console.error(err)
                })
        },
        /**
         * Actualiza la divisa seleccionada con los datos proporcionados y muestra un mensaje de éxito o error.
         */
        actualizar() {
            // Establece la variable de carga como verdadera para mostrar el estado de carga
            this.loadingbtn = true

            // Prepara los datos para actualizar la divisa seleccionada
            let data = {
                nombre: this.nombre,
                codigo: this.codigo.toUpperCase(),
                pais: this.pais,
            }

            // Llama al servicio para actualizar la divisa seleccionada
            service.actualizarDivisa(data, this.divisaSelected.id)
                .then(res => {
                    // Establece la variable de carga como falsa y cierra el diálogo de actualización de divisa
                    this.loadingbtn = false
                    this.dialogUpdate = false

                    // Actualiza la lista de divisas llamando a la función getDivisas()
                    this.getDivisas()

                    // Muestra un mensaje de éxito
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    // Establece la variable de carga como falsa
                    this.loadingbtn = false

                    // Muestra un mensaje de error con el mensaje proporcionado por el servidor
                    Swal.fire({
                        icon: 'error',
                        text: err.response.data.message,
                    })

                    // Registra el error en la consola
                    console.error(err)
                })
        },
        /**
         * Elimina la divisa seleccionada y muestra un mensaje de éxito o error.
         * @function eliminar
         * @memberof NombreDeLaClase
         * @returns {void}
         */
        eliminar() {
            // Establece la variable de carga como verdadera para mostrar el estado de carga
            this.loadingbtn = true

            // Llama al servicio para eliminar la divisa seleccionada
            service.eliminarDivisa(this.divisaSelected.id)
                .then(res => {
                    // Establece la variable de carga como falsa y cierra el diálogo de eliminación de divisa
                    this.loadingbtn = false
                    this.dialogDelete = false

                    // Actualiza la lista de divisas llamando a la función getDivisas()
                    this.getDivisas()

                    // Muestra un mensaje de éxito
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    // Establece la variable de carga como falsa
                    this.loadingbtn = false

                    // Muestra un mensaje de error con el mensaje proporcionado por el servidor
                    Swal.fire({
                        icon: 'error',
                        text: err.response.data.message,
                    })

                    // Registra el error en la consola
                    console.error(err)
                })
        },
        /**
         * Obtiene la lista de divisas del servicio y actualiza la lista local de divisas.
         */
        getDivisas() {
            // Emite un evento para actualizar las divisas en componentes padres, si es necesario
            this.$emit('updateDivisas')

            // Llama al servicio para obtener la lista de divisas
            service.obtenerDivisas()
                .then(res => {
                    // Asigna las divisas obtenidas a la lista local de divisas
                    this.divisas = res
                })
                .catch(err => {
                    // Maneja el error imprimiendo un mensaje en la consola
                    console.error(err)
                })
        },
        /**
         * Obtiene la lista de países desde el servicio.
         */
        getPaises() {
            service.obtenerPaises()
                .then(res => {
                    this.paises = res
                })
                .catch(err => {
                    console.error(err)
                })
        },
    },
    mounted() {
        this.getPaises()
        this.getDivisas()
    },
}
</script>

<style scoped>
.flex {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
</style>