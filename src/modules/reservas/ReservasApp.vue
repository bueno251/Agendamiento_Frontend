<template>
    <div class="content">
        <ReservasAprovadas />
        <ReservasPendientes />
    </div>
</template>

<script>

import Swal from 'sweetalert2';
import reservaService from './service/reservaService';
import ReservasAprovadas from './components/ReservasAprovadas'
import ReservasPendientes from './components/ReservasPendientes'

export default {
    name: 'roomApp',
    components: {
        ReservasAprovadas,
        ReservasPendientes,
    },
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
    },
    methods: {
        /**
         * Aprueba una reserva.
         * Realiza una llamada al servicio para aprobar una reserva por su ID y actualiza la lista de reservas.
         */
        aprobar() {
            this.loadingbtn = true

            reservaService.aprobarReserva(this.reserva.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogAprobar = false
                    this.getReservas() // Actualiza la lista de reservas
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    this.loadingbtn = false
                    Swal.fire({
                        icon: 'success',
                        text: err.response.data.message,
                    })
                    console.log(err)
                })
        },
        /**
         * Rechaza una reserva.
         * Realiza una llamada al servicio para rechazar una reserva por su ID y actualiza la lista de reservas.
         */
        rechazar() {
            this.loadingbtn = true

            reservaService.rechazarReserva(this.reserva.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogRechazar = false
                    this.getReservas() // Actualiza la lista de reservas
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    this.loadingbtn = false
                    Swal.fire({
                        icon: 'success',
                        text: err.response.data.message,
                    })
                    console.log(err)
                })
        },
    },
}
</script>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
</style>