<template>
    <div class="main">
        <div class="d-flex">
            <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
                <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-spacer />
            <v-btn icon class="ma-2" @click="$refs.calendar.next()">
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
        </div>

        <v-calendar ref="calendar" v-model="value" color="primary" :type="type" locale="es"
            :event-overlap-threshold="30" @change="getRooms" @click:date="filterRooms">

            <template v-slot:day-label>
                <div></div>
            </template>

            <template v-slot:day="item">
                <div :class="`day ${availableDate(item.date) ? 'clickeable' : ''}`"
                    @click="availableDate(item.date) ? filterRooms(item) : ''">
                    <h2>
                        {{ item.day }}
                    </h2>
                </div>
            </template>

        </v-calendar>

        <v-dialog :value="dialogRooms" width="90%" persistent>
            <v-card class="pa-5">
                <v-toolbar elevation="0">
                    <v-spacer></v-spacer>
                    <v-btn icon class="ml-3" @click="dialogRooms = false"><v-icon>mdi-close-box</v-icon></v-btn>
                </v-toolbar>
                <v-row class="pt-5 ma-0 w-100">
                    <v-col cols="12" lg="4" md="6" sm="6" v-for="room in roomsFiltered" :key="room.id">
                        <CardRoom :room="room" buttonText="reservar" />
                    </v-col>
                </v-row>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import service from '@/services/service'
import CardRoom from './components/CardRoom'

export default {
    name: 'CalendarioDisponibilidad',

    components: {
        CardRoom,
    },

    data: () => ({
        type: 'month',
        value: '',
        dialogRooms: false,
        rooms: [],
        roomsFiltered: [],
        hoy: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    }),

    methods: {
        getRooms({ start, end }) {
            service.obtenerRooms(start.date, end.date)
                .then(res => {
                    this.rooms = res

                    this.rooms.forEach(room => {
                        // Define una lista de días de la semana con precios iniciales y jornadas
                        let week = [
                            { name: 'Lunes', precio: 0, jornada: 'Semana' },
                            { name: 'Martes', precio: 0, jornada: 'Semana' },
                            { name: 'Miércoles', precio: 0, jornada: 'Semana' },
                            { name: 'Jueves', precio: 0, jornada: 'Semana' },
                            { name: 'Viernes', precio: 0, jornada: 'Semana' },
                            { name: 'Sábado', precio: 0, jornada: 'Semana' },
                        ]

                        // Verifica si la habitación tiene precios definidos
                        if (Array.isArray(room.precios)) {
                            // Mapea los precios por día
                            room.precios.map(day => {
                                // Encuentra el índice del día en la semana
                                const index = week.findIndex((weekDay) => weekDay.name === day.name)

                                // Actualiza el precio y la jornada del día correspondiente
                                if (index !== -1) {
                                    week[index].precio = this.comaEnMiles(day.precio);
                                    week[index].jornada = day.jornada
                                }

                                // Verifica si el día es domingo para ajustar su posición en la semana
                                if (day.name == 'Domingo') {
                                    if (day.jornada == 'Semana') {
                                        week.unshift(day)
                                    } else {
                                        week.push(day)
                                    }
                                }
                            })

                            // Agrupa los precios por jornada y asigna a room.precios
                            room.precios = Object.groupBy(week, (tarifas) => tarifas.jornada)

                        }
                    })
                })
        },
        filterRooms(event) {

            let rooms = []

            this.rooms.forEach(room => {

                if (!room.reservas) {
                    rooms.push(room)
                    return
                }

                let counter = 0

                room.reservas.forEach(reserva => {
                    let dateIn = reserva.fechaEntrada
                    let dateOut = reserva.fechaSalida

                    if (event.date >= dateIn && event.date <= dateOut) {
                        counter += 1
                    }
                })

                if (counter != room.cantidad) {
                    rooms.push(room)
                }
            })

            this.roomsFiltered = rooms
            this.dialogRooms = true
        },
        availableDate(date) {

            if (date < this.hoy) {
                return false
            }

            for (let i = 0; i < this.rooms.length; i++) {
                const room = this.rooms[i];

                if (!room.reservas) {
                    return true
                }

                let counter = 0

                for (let j = 0; j < room.reservas.length; j++) {
                    const reserva = room.reservas[j];

                    let dateIn = reserva.fechaEntrada
                    let dateOut = reserva.fechaSalida

                    if (date >= dateIn && date <= dateOut) {
                        counter += 1
                    }
                }

                if (counter != room.cantidad) {
                    return true
                }
            }

            return false
        },
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
    },
}
</script>

<style scoped>
.main {
    width: 90%;
    min-height: 80%;
}

.day {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    background: #20202044;
}

.clickeable {
    cursor: pointer;
    background: none;

    &:hover {
        background: #99fff644;
    }
}
</style>