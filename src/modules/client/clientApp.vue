<template>
    <div class="content">
        <h1>
            Consultar Clientes
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
            <v-data-table :headers="headers" :items="desserts" :search="search" :loading="loading"
                no-results-text="No hay ningún cliente que coincida" no-data-text="No hay clientes"
                loading-text="Cargando... Por favor espera"
                :footer-props="{ itemsPerPageText: 'Número de filas', pageText: '{0}-{1} de {2}' }">
                <template v-slot:item="row">
                    <tr>
                        <td>
                            <v-menu :offset-x="true" transition="scale-transition">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon v-bind="attrs" v-on="on">
                                        <v-icon>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item link @click="client = row.item, dialogUpdate = true">
                                        <v-list-item-title v-text="'Ajustes'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="client = row.item, dialogDelete = true">
                                        <v-list-item-title v-text="'Eliminar'"></v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                        <td>{{ row.item.documento }}</td>
                        <td>{{ row.item.fullname }}</td>
                        <td>{{ row.item.direccion }}</td>
                        <td>{{ row.item.observacion }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>

        <DialogCreate :show="dialogCreate" @close="dialogCreate = false" @update="getClients()" />

        <DialogUpdate :show="dialogUpdate" :client="client" @close="dialogUpdate = false" @update="getClients()" />

        <v-dialog :value="dialogDelete" width="90%" max-width="500px" persistent>
            <v-card class="pb-5">
                <v-toolbar elevation="0">
                    <v-spacer></v-spacer>
                    <v-btn icon class="ml-3" @click="dialogDelete = false"><v-icon>mdi-close-box</v-icon></v-btn>
                </v-toolbar>
                <v-sheet class="d-flex justify-center align-center flex-column">
                    <h3 class="mb-5">Eliminar al cliente {{ client.fullname }}?</h3>
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
import DialogCreate from "./components/DialogCreate"
import DialogUpdate from "./components/DialogUpdate"

export default {
    name: 'clientApp',
    components: {
        DialogCreate,
        DialogUpdate,
    },
    data() {
        return {
            search: '',
            loading: false,
            loadingbtn: false,
            dialogCreate: false,
            dialogUpdate: false,
            dialogDelete: false,
            client: {},
            desserts: [],
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Documento', key: 'documento', value: 'documento' },
                { text: 'Nombre', key: 'nombre', value: 'fullname' },
                { text: 'Dirección', key: 'direccion', value: 'direccion' },
                { text: 'Observaciones', key: 'observaciones', value: 'observaciones' },
            ],
        }
    },
    methods: {
        /**
         * Obtiene la lista de clientes.
         * Realiza una llamada al servicio para obtener la información de los clientes y asigna los resultados a la variable desserts.
         */
        getClients() {
            this.loading = true

            service.obtenerClientes()
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
         * Elimina un cliente.
         * Realiza una llamada al servicio para eliminar un cliente por su ID y actualiza la lista de clientes.
         */
        deleted() {
            this.loadingbtn = true

            service.eliminarCliente(this.client.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogDelete = false
                    this.getClients() // Actualiza la lista de clientes
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
        this.getClients()
    },
}
</script>

<style scoped></style>