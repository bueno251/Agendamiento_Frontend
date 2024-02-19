<template>
    <v-card width="90%">
        <v-card-title class="blue lighten-2">
            Reservas Aprovadas
        </v-card-title>
        <v-container fluid>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details />
            </v-card-title>
            <v-data-table :headers="headers" :items="reservas" :search="search" :loading="loading"
                :footer-props="{ itemsPerPageText: 'Número de filas', pageText: '{0}-{1} de {2}' }"
                no-results-text="No hay ninguna reserva que coincida" no-data-text="No hay reservas"
                loading-text="Cargando... Por favor espera">
                <template v-slot:item="{ item }">
                    <tr>
                        <td>
                            {{ item }}
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-container>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            search: '',
            loading: false,
            loadingbtn: false,
            dialogAprobar: false,
            dialogRechazar: false,
            dialogComprobante: false,
            reserva: {
                comprobante: '',
            },
            reservas: [],
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Creada el', key: 'created_at', value: 'created_at' },
                { text: 'Fecha Llegada', key: 'datein', value: 'fechaEntrada' },
                { text: 'Fecha Salida', key: 'dateout', value: 'fechaSalida' },
                { text: 'Huespedes', key: 'huespedes', value: 'huespedes' },
                { text: 'Cedula', key: 'cedula', value: 'cedula' },
                { text: 'Huesped', key: 'huesped', value: 'huesped' },
                { text: 'Precio', key: 'precio', value: 'precio' },
                { text: 'Estado', key: 'estado', value: 'estado' },
            ],
            rootBackend: process.env.VUE_APP_URL_BASE.replace('/api', '/storage/'),
        }
    }
}
</script>

<style scoped></style>