<template>
    <div class="content">
        <div class="main">

            <div>
                <h3>Información De La Reserva</h3>
                <p>
                    <strong>
                        Habitacion:
                    </strong>
                    {{ reserva.room.nombre }} (x{{ reserva.noches }} {{ reserva.noches > 1 ? 'Noches' : 'Noche' }})
                </p>
                <p>
                    <strong>
                        Llegada:
                    </strong>
                    {{ reserva.dateIn }}
                </p>
                <p>
                    <strong>
                        Salida:
                    </strong>
                    {{ reserva.dateOut }}
                </p>
                <p>
                    <strong>
                        Adultos:
                    </strong>
                    {{ reserva.adultos }}
                </p>
                <p>
                    <strong>
                        Niños:
                    </strong>
                    {{ reserva.niños }}
                </p>
                <p>
                    <strong>
                        Decoración:
                    </strong>
                    {{ reserva.decoracion.nombre }}
                </p>
                <p>
                    <strong>
                        Desayuno:
                    </strong>
                    {{ reserva.desayuno.nombre }}
                </p>
                <p>
                    <strong>
                        Huesped:
                    </strong>
                    {{ reserva.huespedes[0].nombre }} {{ reserva.huespedes[0].apellido }} ({{
                        reserva.huespedes[0].documento }})
                </p>
            </div>

            <div class="btn">
                <v-btn class="py-10 white--text" color="light-green" :href="linkGoogleCalendar()" target="_blank" link>
                    <span class="d-flex flex-column">
                        <v-icon>
                            mdi-calendar-month
                        </v-icon>
                        <span>
                            Añadir a Google Calendar
                        </span>
                    </span>
                </v-btn>

                <v-btn color="primary" @click="goTo">
                    volver
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>

import vuex from "@/store"
import service from "@/services/service"

export default {
    data() {
        return {
            reserva: vuex.state.reserva,
            porcentajeSeparacion: 0,
            divisa: {
                codigo: '',
            },
            empresa: {}
        }
    },

    methods: {
        /**
         * Formatea un número agregando comas para separar miles y acepta decimales.
         * @param {number} numero - Número que se formateará.
         * @returns {string} Número formateado con comas.
         */
        comaEnMiles(numero) {
            // Convertir el número a cadena y dividir la parte entera de la parte decimal
            let partes = numero.toString().split(',');

            // Expresión regular para agregar comas a la parte entera
            let expParteEntera = /(\d)(?=(\d{3})+(?!\d))/g;
            let repParteEntera = '$1.';

            // Formatear la parte entera y agregar la parte decimal si existe
            let parteEnteraFormateada = partes[0].replace(expParteEntera, repParteEntera);
            let resultado = partes.length === 2 ? parteEnteraFormateada + ',' + partes[1] : parteEnteraFormateada;

            return resultado;
        },
        linkGoogleCalendar() {

            let pais = this.empresa.pais
            let departamento = this.empresa.departamento
            let ciudad = this.empresa.ciudad

            let fechaEntrada = this.formatDate(this.reserva.dateIn)
            let fechaSalida = this.formatDate(this.reserva.dateOut)

            let nombre = this.reserva.room.nombre
            let descripcion = this.reserva.room.descripcion

            let link = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${fechaEntrada}%2F${fechaSalida}&details=${descripcion}&location=${ciudad}%2C%20${departamento}%2C%20${pais}&text=Reserva%20${nombre}`

            return link
        },
        formatDate(date) {
            // Obtener la fecha actual
            let fecha = date.split("-")

            // Obtener los componentes de la fecha
            let año = fecha[0]
            let mes = fecha[1]
            let día = fecha[2]

            // Formatear la fecha según tu requisito
            let fechaFormateada = `${año}${mes}${día}T140000Z`;

            return fechaFormateada
        },
        async getDatos() {

            service.obtenerValoresDefault()
                .then(res => {
                    this.divisa = res.divisa
                })
                .catch(err => {
                    console.error(err)
                })

            service.obtenerConfigReserva()
                .then(res => {
                    this.correoRequired = res.correoObligatorio
                    this.porcentajeSeparacion = res.porcentajeSeparacion
                })
                .catch(err => {
                    console.error(err)
                })

            service.obtenerEmpresa()
                .then(res => {
                    this.empresa = res
                    this.loading = false
                })
                .catch(err => {
                    this.loading = false
                    console.error(err)
                })

        },
        goTo() {
            this.$store.dispatch('setReserva', {})
            this.$router.push({ name: 'viewRooms' })
        },
    },

    mounted() {
        this.getDatos()
    },
}
</script>

<style scoped>
.content {
    justify-content: center;
}

.main {
    padding: 50px 10px;
    display: flex;
    width: 90%;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 50px;
    background-color: #efefef;
    border-radius: 5px;
}

.btn {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
</style>