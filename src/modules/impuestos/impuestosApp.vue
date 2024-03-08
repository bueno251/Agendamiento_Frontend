<template>
    <div class="content">
        <h1>
            Impuestos
        </h1>
        <v-card width="90%">
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details />
                <v-btn class="mx-5" @click="dialogCreate = true" color="primary">
                    <v-icon>mdi-plus-circle</v-icon> agregar
                </v-btn>
            </v-card-title>

            <v-data-table :headers="headers" :items="impuestos" :search="search" :loading="loading"
                no-results-text="No hay ningún impuesto que coincida" no-data-text="No hay impuestos"
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
                                    <v-list-item link @click="impuesto = item, dialogUpdate = true">
                                        <v-list-item-title v-text="'Ajustes'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="impuesto = item, dialogDelete = true">
                                        <v-list-item-title v-text="'Eliminar'"></v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                        <td>{{ item.nombre }}</td>
                        <td>{{ item.codigo }}</td>
                        <td>{{ item.tasa }}%</td>
                        <td>{{ item.tipo.tipo }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>

        <createImpuesto :show="dialogCreate" @close="dialogCreate = false" @update="dialogCreate = false, get()" />

        <v-dialog :value="dialogUpdate" width="90%" max-width="500px" persistent>
            <v-card class="pa-5">
                <v-form ref="formUpdate" v-model="validUpdate" @submit.prevent="update">
                    <v-row>

                        <v-col cols="12" md="6" sm="6">
                            <v-text-field v-model="nombreUpdate" :rules="[rules.required]" outlined>

                                <template v-slot:label>
                                    Nombre <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <v-text-field v-model="codigoUpdate" :rules="[rules.required]" outlined>

                                <template v-slot:label>
                                    codigo <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <v-text-field v-model="tasaUpdate" type="number" min="0" :rules="[rules.required]"
                                hide-spin-buttons outlined>

                                <template v-slot:label>
                                    Tasa <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <v-select v-model="tipoUpdate" :items="tiposImpuesto" :rules="[rules.required]"
                                no-data-text="Espere un momento..." item-text="tipo" item-value="id" outlined required>

                                <template v-slot:label>
                                    Tipo De Impuesto <span class="red--text">*</span>
                                </template>
                            </v-select>
                        </v-col>

                    </v-row>

                    <div class="buttons">
                        <v-btn @click="dialogUpdate = false" color="blue">cancelar</v-btn>
                        <v-btn :disabled="!validUpdate" type="submit" :loading="loadingbtn"
                            color="light-green">crear</v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>

        <v-dialog :value="dialogDelete" width="90%" max-width="500px" persistent>
            <v-card>
                <v-sheet class="d-flex justify-center align-center flex-column pa-5">
                    <h3>Eliminar el impuesto {{ impuesto.nombre }}?</h3>
                    <div class="buttons">
                        <v-btn @click="dialogDelete = false" color="error"
                            class="white--text text--accent-4">cancelar</v-btn>
                        <v-btn @click="deleted" :loading="loadingbtn" color="primary">eliminar</v-btn>
                    </div>
                </v-sheet>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import Swal from 'sweetalert2'
import service from '@/services/service'
import createImpuesto from './components/createImpuesto'

export default {
    name: 'impuestoApp',
    components: {
        createImpuesto,
    },
    watch: {
        impuesto: {
            handler(newItem) {
                if ('id' in newItem) {
                    this.nombreUpdate = newItem.nombre
                    this.codigoUpdate = newItem.codigo
                    this.tasaUpdate = newItem.tasa
                    this.tipoUpdate = newItem.tipo.id
                }
            },
            immediate: true,
        },
    },
    data() {
        return {
            search: '',
            nombre: '',
            nombreUpdate: '',
            codigo: '',
            codigoUpdate: '',
            tipo: '',
            tipoUpdate: '',
            tasa: 0,
            tasaUpdate: 0,
            loading: false,
            loadingbtn: false,
            validCreate: false,
            dialogCreate: false,
            validUpdate: false,
            dialogUpdate: false,
            dialogDelete: false,
            impuestos: [],
            tiposImpuesto: [],
            impuesto: {
                nombre: ''
            },
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Nombre', key: 'nombre', value: 'nombre' },
                { text: 'Código', key: 'codigo', value: 'codigo' },
                { text: 'Tasa', key: 'tasa', value: 'tasa' },
                { text: 'Tipo', key: 'tipo.tipo', value: 'tipo.tipo' },
            ],
            rules: {
                required: value => !!value || 'Campo requerido.',
            },
        }
    },
    methods: {
        get() {
            service.obtenerImpuestos()
                .then(res => {
                    this.impuestos = res
                })
                .catch(err => {
                    console.error(err)
                })
        },
        update() {
            this.loadingbtn = true

            let data = {
                nombre: this.nombreUpdate,
                codigo: this.codigoUpdate.toUpperCase(),
                tasa: this.tasaUpdate,
                tipo: this.tipoUpdate,
            }

            service.actualizarImpuesto(data, this.impuesto.id)
                .then(res => {
                    this.dialogUpdate = false
                    this.loadingbtn = false
                    this.get()

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
        deleted() {
            this.loadingbtn = true

            service.eliminarImpuesto(this.impuesto.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogDelete = false
                    this.get()

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
        getDatos() {
            service.obtenerTiposImpuesto()
                .then(res => {
                    this.tiposImpuesto = res
                })
                .catch(err => {
                    console.error(err)
                })
        },
    },
    mounted() {
        this.getDatos()
        this.get()
    },
}
</script>

<style scoped></style>