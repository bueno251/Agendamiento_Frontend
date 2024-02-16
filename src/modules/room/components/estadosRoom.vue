<template>
    <v-dialog :value="show" width="90%" max-width="900px" persistent>
        <v-card class="pa-5">
            <v-toolbar elevation="0">
                <v-toolbar-title>Bitacora cambios</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon class="ml-3" @click="close"><v-icon>mdi-close-box</v-icon></v-btn>
            </v-toolbar>
            <v-data-table :headers="headers" :items="bitacora" :loading="loading"
                no-data-text="No hay ningún cambio registrado" loading-text="Cargando... Por favor espera"
                :footer-props="{ itemsPerPageText: 'Número de filas', pageText: '{0}-{1} de {2}' }">
                <template v-slot:item="{ item }">
                    <tr>
                        <td>{{ item.user.nombre }}</td>
                        <td>{{ item.estadoAntiguo }}</td>
                        <td>{{ item.estadoNuevo }}</td>
                        <td>{{ item.created_at }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
    </v-dialog>
</template>

<script>

import roomService from '../service/roomService'

export default {
    name: 'estadosRoom',
    props: {
        show: Boolean,
        id: Number,
    },
    watch: {
        id: {
            handler(newId) {
                if (newId && this.show) {
                    this.bitacora = []
                    this.obtener()
                }
            },
            immediate: true,
        }
    },
    data: () => ({
        idSave: '',
        loading: false,
        bitacora: [],
        headers: [
            { text: 'Usuario', key: 'user.nombre', value: 'user.nombre' },
            { text: 'Estado Antiguo', key: 'estadoAntiguo', value: 'estadoAntiguo' },
            { text: 'Estado Nuevo', key: 'estadoNuevo', value: 'estadoNuevo' },
            { text: 'Fecha', key: 'created_at', value: 'created_at' },
        ],
    }),
    methods: {
        /**
         * Obtiene la bitácora de una habitación con el identificador proporcionado.
        */
        obtener() {
            this.loading = true

            roomService.bitacora(this.id)
                .then(res => {
                    this.loading = false
                    this.bitacora = res
                })
                .catch(err => {
                    this.loading = false
                    console.log(err)
                })
        },
        /**
         * Cierra el componente emitiento un evento 'close'.
         */
        close() {
            // Emitir evento 'close'
            this.$emit('close')
        },
    },
}
</script>

<style scoped></style>