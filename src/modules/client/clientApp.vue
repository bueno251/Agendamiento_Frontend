<template>
    <div class="container">
        <h1>
            Consultar Clientes
        </h1>
        <v-card width="90%" class="my-5">
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                    hide-details></v-text-field>
                <v-btn class="mx-5" @click="dialogCreate = true">
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
                        <td>{{ row.item.direccion }}</td>
                        <td>{{ row.item.documento }}</td>
                        <td>{{ row.item.correo }}</td>
                        <td>{{ row.item.observacion }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialogCreate" width="90%" max-width="700px" persistent>
            <v-card class="pa-5">
                <form @submit.prevent="newClient">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="nombre" :rules="[rules.required]" outlined required>
                                <template v-slot:label>
                                    Nombre<span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="direccion" :rules="[rules.required]" outlined required>
                                <template v-slot:label>
                                    Direccion<span class="red--text">*</span>
                                </template></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="documento" :rules="[rules.required, rules.min]" outlined required>
                                <template v-slot:label>
                                    Documento<span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="correo" :rules="[rules.required, rules.email]" outlined required>
                                <template v-slot:label>
                                    Correo<span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea v-model="observacion" auto-grow rows="5" dense label="Observaciones"
                                outlined></v-textarea>
                        </v-col>
                    </v-row>
                    <div class="buttons">
                        <v-btn type="submit" :loading="loadingbtn">crear</v-btn>
                        <v-btn @click="dialogCreate = false">cancelar</v-btn>
                    </div>
                </form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
    data() {
        return {
            search: '',
            nombre: '',
            direccion: '',
            documento: '',
            correo: '',
            observacion: '',
            loading: false,
            loadingbtn: false,
            dialogCreate: false,
            desserts: [
                // {
                //     nombre: 'oscar',
                //     direccion: 'cll',
                //     documento: '1004251387',
                //     correo: 'corro@gmail.com',
                //     observacion: 'Trabaja bien',
                // }
            ],
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Nombre', key: 'nombre', value: 'nombre' },
                { text: 'Dirección', key: 'direccion', value: 'direccion' },
                { text: 'Documento', key: 'documento', value: 'documento' },
                { text: 'Correo', key: 'correo', value: 'correo' },
                { text: 'Observaciones', key: 'observaciones', value: 'observaciones' },
            ],
            rules: {
                required: value => !!value || 'Campo requerido.',
                max: value => value.length <= 20 || 'Maximo 20 caracteres',
                min: value => value.length >= 5 || 'Minimo 5 caracteres',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Correo invalido.'
                },
            },
        }
    },
    methods: {
        newClient() {
            this.loadingbtn = true
            let url = "api/client/create"

            let data = {
                nombre: this.nombre,
                direccion: this.direccion,
                documento: this.documento,
                correo: this.correo,
                observacion: this.observacion,
            }

            this.$axios.post(url, data)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogCreate = false
                    this.nombre = ''
                    this.direccion = ''
                    this.documento = ''
                    this.correo = ''
                    this.observacion = ''
                    Swal.fire({
                        icon: 'success',
                        text: res.data,
                    })
                })
                .catch(err => {
                    this.loadingbtn = false
                    console.log(err);
                    Swal.fire({
                        icon: 'error',
                        text: 'Ocurrio un error codigo de error: ' + err.response.status,
                    })
                })
        },
        getClients() {
            this.loading = true

            let url = "api/client/read"

            this.$axios.get(url)
                .then(res => {
                    console.log(res);
                    this.loading = false
                    this.desserts = res.data
                })
                .catch(err => {
                    console.log(err);
                    this.loading = false
                })
        }
    },
    mounted() {
        this.getClients()
    },
}
</script>

<style scoped></style>