<template>
    <div class="content">
        <h1>
            Consultar Habitaciones
        </h1>
        <v-card width="90%" class="my-5">
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                    hide-details></v-text-field>
                <v-btn class="mx-5" @click="dialogCreate = true" color="primary">
                    <v-icon>mdi-plus-circle</v-icon> agregar
                </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="desserts" :search="search" :loading="loading"
                no-results-text="No hay ninguna habitacion que coincida" no-data-text="No hay habitaciones"
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
                                    <v-list-item link>
                                        <v-list-item-title v-text="'Ajustes'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link>
                                        <v-list-item-title v-text="'Eliminar'"></v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                        <td>{{ row.item.nombre }}</td>
                        <td>{{ row.item.descripcion }}</td>
                        <td>{{ row.item.tipo }}</td>
                        <td>{{ row.item.capacidad }}</td>
                        <td>{{ row.item.estado ? 'Inactivo' : 'Activo' }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
        <DialogCreate :show="dialogCreate" @close="closeCreate" @create="getRooms"></DialogCreate>
    </div>
</template>

<script>

import DialogCreate from "./components/DialogCreate";

export default {
    name: 'roomApp',
    components: {
        DialogCreate,
    },
    data() {
        return {
            search: '',
            loading: false,
            dialogCreate: false,
            desserts: [],
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
            this.dialogCreate = false

            let url = "room/read"

            this.$axios.get(url)
                .then(res => {
                    this.loading = false
                    this.desserts = res.data
                })
                .catch(err => {
                    console.log(err);
                    this.loading = false
                })
        },
        closeCreate(bolean) {
            this.dialogCreate = bolean
        },
    },
    mounted() {
        this.getRooms()
    },
}
</script>

<style scoped></style>