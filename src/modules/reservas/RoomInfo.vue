<template>
    <div class="contenido">
        <section class="room">

            <article class="room-info pa-5">
                <h1 class="mb-5">
                    {{ room.nombre }}
                </h1>
                <span>
                    {{ room.tipo }}
                </span>

                <v-carousel v-model="model" cycle show-arrows-on-hover hide-delimiter-background>
                    <v-carousel-item v-for="img in room.imgs" :key="img.id">
                        <v-sheet height="100%" tile>
                            <v-card class="portrait" :img="rootBackend + img.url" height="100%" width="auto"></v-card>
                        </v-sheet>
                    </v-carousel-item>
                </v-carousel>

                <p class="my-10">
                    {{ room.descripcion }}
                </p>
                <span>
                    Capacidad Maxima: {{ room.capacidad }} {{ room.capacidad > 1 ? 'Personas' : 'Persona' }}
                </span>

            </article>

            <v-simple-table>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th>
                                Día
                            </th>
                            <th>
                                Normal
                            </th>
                            <th>
                                Jornada
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(day, i) in room.precios" :key="day.name">
                            <template v-if="i < 7">
                                <td>{{ day.name }}</td>
                                <td>$ {{ comaEnMiles(day.precio) }} COP</td>
                                <td>{{ day.jornada }}</td>
                            </template>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>

            <article>
                <h2 class="text-center">
                    Caracteristicas De La Habitación
                </h2>

                <div class="caracteristics">
                    <template v-for="(item, index) in caracteristicas">
                        <div v-if="includeCaracteristic(item, room)" class="caracteristic"
                            :key="`room${room.index}caracteris${index}`">
                            <v-avatar color="blue">
                                <v-icon dark>
                                    mdi-{{ item.icon }}
                                </v-icon>
                            </v-avatar>
                            <div class="infoCaracteristic">
                                <h4>
                                    {{ item.nombre }}
                                </h4>
                                <p>
                                    {{ item.descripcion }}
                                </p>
                            </div>
                        </div>
                    </template>
                </div>
            </article>
        </section>

        <section class="calendar pa-5">
            <v-card class="pa-5 sticky" elevation="5">
                <v-form v-model="valid" ref="fechas">
                    <v-row>

                        <v-col cols="12">
                            <v-date-picker v-model="dates" :min="hoy" :max="maxDate" :events="festivos"
                                :allowed-dates="allowedDates" event-color="red lighten-1" locale="es" full-width range
                                no-title scrollable>
                            </v-date-picker>
                        </v-col>

                        <v-col cols="12" md="6">
                            <label>Fecha De LLegada <span class="red--text">*</span></label>
                            <v-text-field v-model="fechaLlegada" :rules="[rules.required, rules.date]"
                                prepend-inner-icon="mdi-calendar" readonly dense outlined required>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <label>Fecha De Salida <span class="red--text">*</span></label>
                            <v-text-field v-model="fechaSalida" :rules="[rules.required, rules.date]"
                                prepend-inner-icon="mdi-calendar" readonly dense outlined required>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" v-if="room.has_desayuno">
                            <label>Desayunos<span class="red--text">*</span></label>
                            <v-select v-model="desayuno" :items="desayunos" no-data-text="No hay desayunos"
                                item-text="desayuno" item-value="id" dense outlined>
                            </v-select>
                        </v-col>

                        <v-col cols="12" md="6" v-if="room.has_decoracion">
                            <label>Decoraciones<span class="red--text">*</span></label>
                            <v-select v-model="decoracion" :items="decoraciones" no-data-text="No hay decoraciones"
                                item-text="decoracion" item-value="id" dense outlined>
                            </v-select>
                        </v-col>

                        <v-col cols="12" md="6">
                            <label>Adultos<span class="red--text">*</span></label>
                            <v-select v-model="adultos" :items="selectAdultos"
                                :item-text="item => `${item.cantidad} ${item.val > 0 ? '+ $' + comaEnMiles(item.val) : ''}`"
                                return-object dense outlined>
                            </v-select>
                        </v-col>

                        <v-col cols="12" md="6">
                            <label>Niños<span class="red--text">*</span></label>
                            <v-select v-model="niños" :items="selectNiños"
                                :item-text="item => `${item.cantidad} ${item.val > 0 ? '+ $' + comaEnMiles(item.val) : ''}`"
                                return-object dense outlined>
                            </v-select>
                        </v-col>

                    </v-row>

                    <h2>
                        $ {{ comaEnMiles(precio) }} COP
                    </h2>


                    <div class="buttons mt-5">
                        <v-btn @click="$router.back()" color="blue">cancelar</v-btn>
                        <v-btn @click="datosCliente = true" :disabled="!valid" color="light-green">
                            siguiente
                        </v-btn>
                    </div>
                </v-form>
            </v-card>
        </section>

        <v-dialog :value="datosCliente" width="90%" max-width="500px" persistent>
            <v-card class="pa-5 sticky" elevation="5">
                <v-form v-model="validDatosCliente" ref="fechas" @submit.prevent="agendar">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="cedula" :rules="[rules.required]" label="Cedula" type="number"
                                hide-spin-buttons dense outlined required>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-text-field v-model="telefono" :rules="[rules.required, rules.phone]" label="Telefono" dense
                                outlined required>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <div class="buttons mt-5">
                        <v-btn @click="datosCliente = false" color="blue">cancelar</v-btn>
                        <v-btn :disabled="!validDatosCliente" :loading="loadingbtn" color="light-green" type="submit">
                            siguiente
                        </v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import colombiaHolidays from 'colombia-holidays'
import reservaService from './service/reservaService'

export default {
    name: 'RoomInfo',
    data() {
        return {
            cedula: '',
            telefono: '',
            desayuno: null,
            decoracion: null,
            maxDate: '',
            cantidadRooms: 1,
            model: 0,
            valid: false,
            validDatosCliente: false,
            loading: false,
            loadingbtn: false,
            datosCliente: false,
            file: null,
            dates: [],
            datesInvalid: [],
            festivos: [],
            caracteristicas: [],
            adultos: {
                cantidad: 2,
                val: 0
            },
            niños: {
                cantidad: 0,
                val: 0
            },
            desayunos: [
                {
                    id: null,
                    desayuno: 'Ninguno'
                }
            ],
            decoraciones: [
                {
                    id: null,
                    decoracion: 'Ninguna'
                }
            ],
            hoy: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            room: {
                nombre: '',
                estado: '',
                capacidad: '',
                descripcion: '',
                tipo: '',
            },
            rules: {
                required: value => !!value || 'Campo requerido.',
                date: () => {
                    for (let dates of this.datesInvalid) {
                        if (
                            (this.dates[0] >= dates.fecha_entrada && this.dates[0] <= dates.fecha_salida) ||
                            (this.dates[1] >= dates.fecha_entrada && this.dates[1] <= dates.fecha_salida) ||
                            (this.dates[0] <= dates.fecha_entrada && this.dates[1] >= dates.fecha_salida)
                        ) {
                            return 'Fecha No Valida'
                        }
                    }

                    return true
                },
                file: file => {
                    const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
                    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'];

                    if (!file) {
                        return 'Campo requerido.'
                    }

                    if (!allowedFormats.includes(file.type) && !allowedExtensions.includes(file.name.slice(-4).toLowerCase())) {
                        return 'El archivo debe ser una imagen (JPEG, PNG, GIF) o un archivo PDF';
                    }

                    return true;
                },
                phone: value => {
                    const pattern = /^(\+?[0-9]{1,3}[-.\s]?)?(\([0-9]{1,4}\)|[0-9]{1,4})[-.\s]?[0-9]{1,10}$/
                    return pattern.test(value) || 'Número de teléfono inválido.'
                },
            },
            rootBackend: process.env.VUE_APP_URL_BASE.replace('/api', '/storage/'),
        }
    },
    computed: {
        /**
         * Devuelve la fecha de llegada seleccionada.
         */
        fechaLlegada() {
            return this.dates[0] || ''
        },
        /**
         * Devuelve la fecha de salida seleccionada.
         */
        fechaSalida() {
            return this.dates[1] || ''
        },
        /**
         * Calcula el total de huéspedes sumando adultos y niños.
         */
        huespedes() {
            return this.adultos.cantidad + this.niños.cantidad
        },
        /**
         * Calcula el precio total de la reserva, teniendo en cuenta las fechas de entrada y salida, así como el número de adultos y niños.
         */
        precio() {
            let precio = 0

            if (this.dates.length === 2) {
                let fechaInicio = new Date(this.dates[0].replace(/-/g, '/'))
                let fechaFinal = new Date(this.dates[1].replace(/-/g, '/'))

                // Calcula el precio acumulado por cada día de estancia
                while (fechaInicio <= fechaFinal) {
                    precio += this.room.precios[fechaInicio.getDay()].precio

                    fechaInicio.setDate(fechaInicio.getDate() + 1)
                }
            }

            // Agrega el precio de los adultos y niños adicionales
            precio += this.adultos.val
            precio += this.niños.val

            return precio
        },
        /**
         * Genera un array con opciones para seleccionar el número de adultos adicionales, considerando la capacidad máxima de la habitación.
         */
        selectAdultos() {
            let adultos = []

            // Límite de adultos adicionales según la capacidad máxima de la habitación y el número actual de adultos seleccionados
            let limit = this.room.capacidad - this.huespedes + this.adultos.cantidad

            for (let i = 0; i < limit; i++) {
                let value = 0

                // Asigna el valor del precio de adultos adicionales si está disponible
                if (this.room.precios.length > 7) {
                    value = i > 1 ? this.room.precios[7].precio : 0
                }

                let cantidad = i + 1

                adultos.push({
                    cantidad: cantidad,
                    val: value * (cantidad - 2),
                })
            }

            return adultos
        },
        /**
         * Genera un array con opciones para seleccionar el número de niños adicionales, considerando la capacidad máxima de la habitación.
         */
        selectNiños() {
            let niños = [
                {
                    cantidad: 0,
                    val: 0
                }
            ]

            // Límite de niños adicionales según la capacidad máxima de la habitación y el número actual de niños seleccionados
            let limit = this.room.capacidad - this.huespedes + this.niños.cantidad

            for (let i = 0; i < limit; i++) {
                let value = 0

                // Asigna el valor del precio de niños adicionales si está disponible
                if (this.room.precios.length > 7) {
                    value = i > 1 ? this.room.precios[8].precio : 0
                }

                let cantidad = i + 1

                niños.push({
                    cantidad: cantidad,
                    val: value * (cantidad - 2),
                })
            }

            return niños
        },
    },
    watch: {
        /**
         * Observa cambios en la fecha de salida y ajusta las fechas si es necesario.
         */
        fechaSalida: function () {
            if (this.dates.length > 1) {
                let fecha1 = new Date(this.dates[0])
                let fecha2 = new Date(this.dates[1])

                // Ajusta la fecha de salida si es igual a la fecha de llegada
                if (fecha1.toISOString().slice(0, 10) === fecha2.toISOString().slice(0, 10)) {
                    fecha2.setDate(fecha2.getDate() + 1)
                    this.dates[1] = fecha2.toISOString().slice(0, 10)
                }

                // Ordena las fechas de llegada y salida
                let sortDates = this.dates.toSorted()
                this.dates = sortDates
            }
        }
    },
    methods: {
        /**
         * Obtiene la información de una habitación según su ID de la ruta.
         * Si la obtención es exitosa, actualiza la variable 'room' con la información de la habitación.
         * En caso de error, redirige al usuario a la vista de habitaciones ('viewRooms').
         */
        getRoom() {
            let id = this.$route.params.id

            reservaService.obtenerRoom(id)
                .then(res => {
                    this.room = res
                })
                .catch(err => {
                    console.log(err)
                    this.$router.push({ name: 'viewRooms' })
                })
        },
        /**
         * Inicia el proceso de agendamiento.
         * Prepara la información necesaria (fechas, habitación, cantidad de personas, etc.) y la almacena en el estado global.
         * Luego, redirige al usuario a la vista de pago ('pagar').
         */
        agendar() {
            this.loadingbtn = true

            let data = {
                dateIn: this.fechaLlegada,
                dateOut: this.fechaSalida,
                room: this.room,
                adultos: this.adultos.cantidad,
                niños: this.niños.cantidad,
                precio: this.precio,
                cedula: this.cedula,
                telefono: this.telefono,
                cantidad_rooms: this.cantidadRooms,
            }

            if (this.desayuno) {
                data.desayuno = this.desayuno
            }

            if (this.decoracion) {
                data.decoracion = this.decoracion
            }

            this.$store.dispatch('setReserva', data)

            this.$router.push({ name: 'pagar' })
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
         * Obtiene los días festivos en Colombia.
         * Prepara un rango de fechas desde hoy hasta un año después y obtiene los festivos de ambos años.
         * Actualiza la variable 'festivos' con la lista de días festivos.
         */
        getFestivos() {
            let hoy = new Date(Date.now())

            let festivos = colombiaHolidays.getColombiaHolidaysByYear(hoy.getFullYear())

            hoy.setFullYear(hoy.getFullYear() + 1)
            this.maxDate = hoy.toISOString().substr(0, 10)

            let festivos2 = colombiaHolidays.getColombiaHolidaysByYear(hoy.getFullYear())

            festivos = festivos.map((date) => {
                return date.holiday
            })

            festivos2 = festivos2.map((date) => {
                return date.holiday
            })

            this.festivos = festivos.concat(festivos2)
        },
        /**
         * Verifica si una fecha está permitida según las fechas invalidas obtenidas previamente.
         * @param {string} value - Fecha a verificar.
         * @returns {boolean} - Indica si la fecha está permitida.
         */
        allowedDates(value) {
            for (let dates of this.datesInvalid) {
                if (value >= dates.fecha_entrada && value <= dates.fecha_salida) {
                    return false
                }
            }

            return true
        },
        /**
         * Obtiene las fechas invalidas para la habitación actual y actualiza la variable 'datesInvalid'.
         */
        getDates() {
            let id = this.$route.params.id

            reservaService.getFechasRoom(id)
                .then(res => {
                    this.datesInvalid = res
                })
                .catch(err => {
                    console.log(err)
                })
        },
        /**
         * Verifica si una característica está incluida en las características de una habitación.
         * @param {object} caracteris - Característica a verificar.
         * @param {object} room - Habitación a la que se le verificará la característica.
         * @returns {boolean} - Indica si la característica está incluida en la habitación.
         */
        includeCaracteristic(caracteris, room) {
            return room.caracteristicas.includes(caracteris.id)
        },
        /**
         * Obtiene la información de desayunos, decoraciones y características para ser utilizada en el agendamiento.
         * Actualiza las variables 'desayunos', 'decoraciones' y 'caracteristicas'.
         */
        getDatos() {
            reservaService.obtenerDesayunos()
                .then(res => {
                    this.desayunos = [...this.desayunos, ...res]
                })
                .catch(err => {
                    console.log(err)
                })

            reservaService.obtenerDecoraciones()
                .then(res => {
                    this.decoraciones = [...this.decoraciones, ...res]
                })
                .catch(err => {
                    console.log(err)
                })

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
        this.getRoom()
        this.getDates()
        this.getDatos()
        this.getFestivos()
    },
}
</script>

<style scoped>
.contenido {
    display: flex;
    margin: 0;
    padding: 0;
    width: 100%;
    justify-content: center;
    gap: 1%;
}

.room {
    width: min(100%, 800px);
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.room h1 {
    font-size: 2rem;
}

h1,
h2 {
    text-wrap: balance;

}

.room p {
    text-wrap: pretty;
}

.calendar {
    width: min(95%, 500px);
    height: 100%;
    position: relative;
}

.sticky {
    position: sticky;
    top: 20px;
}

.caracteristics {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
}

.caracteristic {
    display: flex;
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

@media only screen and (max-width: 800px) {
    .contenido {
        flex-direction: column;
        align-items: center;
    }
}
</style>