<template>
    <v-row class="pt-5 ma-0 w-100">
        <v-col cols="12" lg="4" md="6" v-for="room in rooms" :key="room.id">
            <v-card elevation="5" outlined>
                <v-card-title>
                    <h4 class="blue--text text-center w-100 balance">
                        {{ room.nombre }}
                    </h4>
                </v-card-title>

                <v-card-text>
                    <v-card class="portrait" :img="rootBackend + room.imgs[0].url" height="300" width="600"></v-card>

                    <v-divider class="my-2" />

                    <p class="">
                        {{ room.descripcion }}
                    </p>

                    <v-divider class="my-2" />

                    <template v-for="(precios, jornada, index) in room.precios">
                        <h1 v-if="index < 2" :key="`${jornada}${index}`" class="blue--text text-center w-100">
                            $ {{ comaEnMiles(precios[0].precio) }} COP
                        </h1>
                        <p v-if="index < 2" :key="`${jornada} - ${index}`" class="text-center w-100">
                            De {{ precios[0].name }} A {{ precios[precios.length - 1].name }}
                        </p>
                    </template>

                    <v-divider class="my-2" />

                    <p>Incluye</p>
                    <div class="caracteristics">
                        <template v-for="(item, index) in caracteristicas">
                            <div v-if="includeCaracteristic(item, room)" class="caracteristic"
                                :key="`room${room.index}caracteris${index}`">
                                <v-avatar color="blue">
                                    <v-icon dark>
                                        mdi-{{ item.icon }}
                                    </v-icon>
                                </v-avatar>
                                <p>
                                    {{ item.nombre }}
                                </p>
                            </div>
                        </template>
                    </div>

                    <v-divider class="my-2" />

                    <p class="text-uppercase">
                        Capacidad de: <span class="blue--text font-weight-bold">{{ room.capacidad }}</span> {{
                            room.capacidad > 1 ?
                            'Personas' : 'Persona' }}
                    </p>
                </v-card-text>

                <v-card-actions class="w-100 justify-center">
                    <v-btn @click="goToRoom(room.id)" color="primary" rounded>
                        Disponibilidad
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>

// import Swal from 'sweetalert2'
import reservaService from './service/reservaService'

export default {
    name: 'ReservasInterno',
    components: {
    },
    data: () => ({
        value: '',
        rooms: [],
        caracteristicas: [],
        dialog: false,
        dialogAgendar: false,
        rootBackend: process.env.VUE_APP_URL_BASE.replace('/api', '/storage/'),
    }),
    methods: {
        /**
        * Obtiene la información de todas las habitaciones.
        * Organiza los precios de cada habitación agrupándolos por jornada.
        * Actualiza la variable 'rooms' con la información de las habitaciones.
        */
        getRooms() {
            reservaService.obtenerRooms()
                .then(res => {
                    res.forEach(room => {
                        room.precios = Object.groupBy(room.precios, (price) => price.jornada)
                    })
                    this.rooms = res
                })
                .catch(err => {
                    console.log(err)
                })
        },
        /**
         * Redirige al usuario a la vista de una habitación específica.
         * @param {number} id - ID de la habitación a la que se redirigirá.
         */
        goToRoom(id) {
            this.$router.push({ name: 'room', params: { id: id } })
        },
        /**
         * Formatea un número agregando comas para separar miles.
         * @param {number} numero - Número que se formateará.
         * @returns {string} Número formateado con comas.
         */
        comaEnMiles(numero) {
            let exp = /(\d)(?=(\d{3})+(?!\d))/g //* expresión regular que busca tres dígitos
            let rep = '$1.' //parámetro especial para splice porque los números no son menores a 100
            return numero.toString().replace(exp, rep)
        },
        /**
         * Verifica si una característica está incluida en las características de una habitación.
         * @param {object} caracteristica - Característica a verificar.
         * @param {object} room - Habitación a la que se le verificará la característica.
         * @returns {boolean} - Indica si la característica está incluida en la habitación.
         */
        includeCaracteristic(caracteristica, room) {
            return room.caracteristicas.includes(caracteristica.id)
        },
        /**
         * Obtiene la información de las características disponibles y actualiza la variable 'caracteristicas'.
         */
        getCaracteristicas() {
            reservaService.obtenerCaracteristicas()
                .then(res => {
                    this.caracteristicas = res
                })
                .catch(err => {
                    console.log(err)
                })
        },
    },
    mounted() {
        this.getRooms()
        this.getCaracteristicas()
    },
};
</script>

<style scoped>
.w-100 {
    width: 100%;
}

.balance {
    text-wrap: balance;
}

.caracteristics {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 15px;
}

.caracteristic {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 10px;
    width: 100%;
    height: 100%;
}

.caracteristic p {
    margin: 0;
    text-align: center;
}
</style>