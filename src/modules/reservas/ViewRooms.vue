<template>
    <v-row class="pt-5 ma-0 w-100">
        <v-col cols="12" lg="4" md="6" sm="6" v-for="room in rooms" :key="room.id">
            <v-card class="flex" elevation="5" height="100%" outlined>
                <div>
                    <v-card-title>
                        <h4 class="blue--text text-center w-100 balance">
                            {{ room.nombre }}
                        </h4>
                    </v-card-title>

                    <v-card-text>
                        <v-card class="portrait" :img="rootBackend + room.imgs[0].url" height="300"
                            width="600"></v-card>

                        <v-divider class="my-2" />

                        <p class="">
                            {{ room.descripcion }}
                        </p>

                        <v-divider class="my-2" />

                        <template v-for="(precios, jornada, index) in room.precios">
                            <h1 v-if="jornada != 'null'" :key="`${jornada}${index}`"
                                class="blue--text text-center w-100">
                                $ {{ comaEnMiles(precioToDolar(precios[0].precio)) }} {{ divisa.codigo }}
                            </h1>
                            <p v-if="jornada != 'null'" :key="`${jornada} - ${index}`"
                                class="d-flex flex-column text-center w-100">
                                De {{ precios[0].name }} A {{ precios[precios.length - 1].name }}
                                <sub v-if="jornada == 'Semana'">Dias no previos a festivos</sub>
                            </p>
                        </template>

                        <v-divider class="my-2" />

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
                </div>

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
import service from '@/services/service'

export default {
    name: 'ReservasInterno',
    data: () => ({
        value: '',
        dolarPrice: 0,
        priceInDolar: false,
        dolarPriceAuto: true,
        rooms: [],
        caracteristicas: [],
        divisa: {
            codigo: '',
        },
        dialog: false,
        dialogAgendar: false,
        rootBackend: process.env.VUE_APP_URL_BASE + '/storage/',
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
                            { name: 'Lunes', precio: 0, jornada: '' },
                            { name: 'Martes', precio: 0, jornada: '' },
                            { name: 'Miércoles', precio: 0, jornada: '' },
                            { name: 'Jueves', precio: 0, jornada: '' },
                            { name: 'Viernes', precio: 0, jornada: '' },
                            { name: 'Sábado', precio: 0, jornada: '' },
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
         * Redirige al usuario a la vista de una habitación específica.
         * @param {number} id - ID de la habitación a la que se redirigirá.
         */
        goToRoom(id) {
            this.$router.push({ name: 'room', params: { id: id } })
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
        /**
         * Convierte un precio de la moneda local a dólares si está habilitada la opción de mostrar en dólares.
         * @param {number} numero - El precio en la moneda local.
         * @returns {number} - El precio convertido a dólares, si está habilitada la opción; de lo contrario, devuelve el precio original.
         */
        precioToDolar(numero) {
            // Verifica si la opción de mostrar en dólares está habilitada
            if (!this.priceInDolar) {
                // Si no está habilitada, devuelve el precio original
                return numero
            }

            // Convierte el precio a dólares y redondea a 2 decimales
            return (numero / this.dolarPrice).toFixed(2)
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
            service.obtenerCaracteristicas()
                .then(res => {
                    this.caracteristicas = res
                })
                .catch(err => {
                    console.error(err)
                })
        },
        /**
         * Obtiene los valores predeterminados, como la divisa, el estado de la opción de mostrar en dólares,
         * el precio automático del dólar y el precio actual del dólar.
         * @async
         * @function getDefault
         * @memberof NombreDeLaClase
         * @returns {Promise<void>} Una promesa que se resuelve una vez que se obtienen los valores predeterminados.
         */
        async getDefault() {
            try {
                // Obtiene los valores predeterminados del servicio
                let res = await service.obtenerValoresDefault()

                // Asigna los valores obtenidos a las propiedades correspondientes
                this.divisa = res.divisa
                this.priceInDolar = res.priceInDolar
                this.dolarPriceAuto = res.dolarPriceAuto
                this.dolarPrice = res.dolarPrice

                // Verifica si la opción de mostrar en dólares y el precio automático del dólar están habilitados
                if (this.priceInDolar && this.dolarPriceAuto) {
                    // Si están habilitados, obtiene el precio actual del dólar
                    res = await service.valorDolar()
                    this.dolarPrice = res.valor
                }
            } catch (err) {
                // Maneja el error estableciendo la opción de mostrar en dólares como falsa y registrando el error
                this.priceInDolar = false
                console.error(err)
            }
        },
    },
    async mounted() {
        this.getDefault()
        this.getRooms()
        this.getCaracteristicas()
    },
};
</script>

<style scoped>
.w-100 {
    width: 100%;
}

.flex {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.portrait {
    aspect-ratio: 3/2;
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