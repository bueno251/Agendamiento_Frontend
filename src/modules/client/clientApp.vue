<template>
    <div class="content">
        <h1>
            Consultar Clientes
        </h1>
        <v-card width="90%" class="my-5">
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                    hide-details></v-text-field>
                <v-btn class="mx-5" @click="dialogCreate = true" color="primary">
                    <v-icon>mdi-plus-circle</v-icon> agregar cliente
                </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="desserts" :search="search" :loading="loading"
                no-results-text="No hay ningun cliente que coincida" no-data-text="No hay clientes"
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
                        <td>{{ row.item.fullname }}</td>
                        <td>{{ row.item.direccion }}</td>
                        <td>{{ row.item.documento }}</td>
                        <td>{{ row.item.correo }}</td>
                        <td>{{ row.item.observacion }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
        <DialogCreate :show="dialogCreate" @close="close" @create="getClients"></DialogCreate>
        <DialogUpdate :show="dialogUpdate" :client="client" @close="close" @update="getClients"></DialogUpdate>
        <v-dialog :value="dialogDelete" width="90%" max-width="500px" persistent>
            <v-card>
                <v-sheet class="d-flex justify-center align-center flex-column pa-5">
                    <h3>Eliminar al cliente {{ client.fullname }}?</h3>
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
import DialogCreate from "./components/DialogCreate";
import DialogUpdate from "./components/DialogUpdate";
import clienteService from './services/clienteService'

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
                { text: 'Nombre', key: 'nombre', value: 'fullname' },
                { text: 'Dirección', key: 'direccion', value: 'direccion' },
                { text: 'Documento', key: 'documento', value: 'documento' },
                { text: 'Correo', key: 'correo', value: 'correo' },
                { text: 'Observaciones', key: 'observaciones', value: 'observaciones' },
            ],
        }
    },
    methods: {
        getClients() {
            this.loading = true
            this.close()

            clienteService.obtener()
                .then(res => {
                    this.loading = false
                    this.desserts = res
                })
                .catch(err => {
                    this.loading = false
                    console.log(err);
                })
        },
        deleted() {
            this.loadingbtn = true

            clienteService.eliminar(this.client.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogDelete = false
                    this.getClients()
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
        this.getClients()
    },
}
</script>

<style scoped></style>