<template>
    <v-row class="pt-5 ma-0 w-100">
        <v-col cols="12" lg="4" md="6" sm="6" v-for="room in rooms" :key="room.id">
            <CardRoom :room="room" />
        </v-col>
    </v-row>
</template>

<script>

// import Swal from 'sweetalert2'
import service from '@/services/service'
import CardRoom from './components/CardRoom'

export default {
    name: 'ViewRooms',

    components: {
        CardRoom,
    },

    data: () => ({
        rooms: [],
    }),

    methods: {
        /**
         * Obtiene la información de las habitaciones y organiza los precios por día y jornada.
         */
        getRooms() {
            // Llama al servicio para obtener la información de las habitaciones
            service.obtenerRooms()
                .then(res => {
                    // Almacena la información de las habitaciones en this.rooms
                    this.rooms = res
                    // Itera sobre cada habitación
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
                .catch(err => {
                    // Maneja el error en caso de fallo en la obtención de las habitaciones
                    console.error(err)
                })
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

    async mounted() {
        this.getRooms()
    },
}
</script>

<style scoped>
.w-100 {
    width: 100%;
}
</style>